import type { Entity } from "@rbxts/jecs";
import { useEffect, useState } from "@rbxts/react";
import { useWorld } from "app/contexts/world-context";

export function useHasComponent(ent: Entity, t: Entity, deps: unknown[] = []) {
	const world = useWorld();

	const [tagged, setTagged] = useState(false);

	useEffect(() => {
		setTagged(world.has(ent, t));

		const added = world.added(t, (e) => {
			if (e === ent) {
				setTagged(world.has(ent, t));
			}
		});
		const removed = world.removed(t, (e) => {
			if (e === ent) {
				task.defer(() => {
					setTagged(world.has(ent, t));
				});
			}
		});

		return () => {
			added();
			removed();
		};
	}, deps);

	return tagged;
}
