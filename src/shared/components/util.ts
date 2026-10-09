import { component, meta, tag } from "@rbxts/jecs";

export const Replicates = tag();
export function replicatedComponent<T>() {
	const entity = component<T>();
	meta(entity, Replicates);
	return entity;
}

export function replicatedTag() {
	const entity = tag();
	meta(entity, Replicates);
	return entity;
}
