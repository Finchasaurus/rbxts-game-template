import type { Entity, World } from "@rbxts/jecs";
import { useEffect, useMemo } from "@rbxts/react";
import { createWorld } from "shared/core/world";

export function createBasicStoryWorld() {
	return useMemo(() => {
		const world = createWorld();
		const entity = world.entity();

		return { world, entity };
	}, []);
}

export function syncStoryComponent<T>(world: World, ent: Entity, cmp: Entity<T>, ctrl: T) {
	useEffect(() => {
		world.set(ent, cmp, ctrl);
	}, [ctrl]);
}
