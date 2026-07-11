import { IS_PAIR, pair, pair_first, pair_second, Wildcard, type Entity } from "@rbxts/jecs";
import { useEffect, useState } from "@rbxts/react";
import { useWorld } from "app/contexts/world-context";

export function useGetComponent<T>(ent: Entity, id: Entity<T>, deps: unknown[] = []) {
	const [output, setOutput] = useState<T | undefined>();

	const world = useWorld();

	useEffect(() => {
		setOutput(world.get(ent, id));

		const cmpa = IS_PAIR(id) ? pair_first(world, id) : id;
		const cmpb = IS_PAIR(id) ? pair_second(world, id) : undefined;

		const added = world.added(cmpa, (e) => {
			if (e === ent) {
				setOutput(world.get(ent, id));
			}
		});

		const changed = world.changed(cmpa, (e) => {
			if (e === ent) {
				setOutput(world.get(ent, id));
			}
		});

		const removed = world.removed(cmpa, (e, rmvd) => {
			if (e !== ent) return;

			if (cmpb === Wildcard && IS_PAIR(rmvd)) {
				let val: T | undefined;
				let idx = 0;

				while (true) {
					const t = world.target(e, cmpa, idx);
					if (t === undefined) break;

					idx++;

					if (t === pair_second(world, rmvd)) continue;

					val = world.get(e, pair(cmpa, t)) as T | undefined;
					break;
				}
				setOutput(val);
			} else if (rmvd === id) {
				setOutput(undefined);
			}
		});

		return () => {
			added();
			changed();
			removed();
		};
	}, deps);

	return output;
}
