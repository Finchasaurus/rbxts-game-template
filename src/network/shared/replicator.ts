import type { World } from "@rbxts/jecs";
import type { ReplecsLib } from "@rbxts/replecs";
import { create } from "@rbxts/replecs";

let r: ReplecsLib;

export function initReplicator(world: World) {
	r = create(world);
}

export function replicator() {
	return r;
}
