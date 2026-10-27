import type { Entity, Tag } from "@rbxts/jecs";
import { component, IsA, meta, Name, pair, tag } from "@rbxts/jecs";
import { shared } from "@rbxts/replecs";

export const Replicates = tag();

export function replicatedComponent<T>(cmp: Entity<T> = component<T>()) {
	meta(cmp, Replicates);
	return cmp;
}

export function replicatedTag(cmp: Tag = tag()) {
	meta(cmp, Replicates);
	return cmp;
}

export const Renderable = replicatedComponent<Instance>();
meta(Renderable, Name, "Renderable");
meta(Renderable, shared);

export function renderable<T extends Instance>(cmp: Entity<T> = component<T>()) {
	meta(cmp, pair(IsA, Renderable));
	return cmp;
}
