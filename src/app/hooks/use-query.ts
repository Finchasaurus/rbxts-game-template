import type { Entity } from "@rbxts/jecs";
import { type Id, type InferComponents, type Query } from "@rbxts/jecs";
import { monitor } from "@rbxts/jecs-utils";
import { useEffect, useState } from "@rbxts/react";

type QueryResult<T extends Id[]> = [Entity, ...InferComponents<T>];

export function useQuery<T extends Id[]>(query: Query<T>, deps: unknown[] = []) {
	const [results, setResults] = useState<QueryResult<T>[]>([]);

	useEffect(() => {
		let current: QueryResult<T>[] = [];
		const indexMap = new Map<Entity, number>();

		for (const row of query) {
			const [entity] = row;

			indexMap.set(entity, current.size());
			current.push(row as QueryResult<T>);
		}

		setResults(current);

		const m = monitor(query);

		m.added((entity) => {
			if (indexMap.has(entity)) return;

			// Re-query the entity to get current component values.
			for (const row of query) {
				if (row[0] !== entity) continue;

				const nxt = table.clone(current);

				indexMap.set(entity, nxt.size());
				nxt.push(row as QueryResult<T>);

				current = nxt;
				setResults(nxt);
				break;
			}
		});

		m.removed((entity) => {
			const idx = indexMap.get(entity);
			if (idx === undefined) return;

			const nxt = table.clone(current);

			indexMap.delete(entity);

			const last = nxt.pop();

			if (last !== undefined && last[0] !== entity) {
				nxt[idx] = last;
				indexMap.set(last[0], idx);
			}

			current = nxt;
			setResults(nxt);
		});

		return () => {
			m.disconnect();
		};
	}, deps);

	return results;
}
