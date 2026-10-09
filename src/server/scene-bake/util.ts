import { type Entity, type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import type { EvaluateInstanceTree, InstanceTree } from "@rbxts/validate-tree";
import { Triggers } from "shared/components";

export type SceneBakeCallback<T extends InstanceTree> = (
	world: World,
	id: Entity,
	instance: EvaluateInstanceTree<T>,
) => void;

export interface SceneTypeDefinition<T extends InstanceTree> {
	tree: T;
	renderable?: Entity<EvaluateInstanceTree<T>>;
	callback: SceneBakeCallback<T>;
}

export function getLinkedEntityFromInstance(instance: Instance, attribute = "Links"): Entity | undefined {
	const handle = instance.GetAttribute<InstanceHandle>(attribute);
	const target = handle?.Get();

	if (target === undefined) {
		return undefined;
	}

	return ref(target);
}

export function getLinkedEntity(world: World, entity: Entity): Entity | undefined {
	return world.target(entity, Triggers);
}

export function defineSceneType<T extends InstanceTree>(definition: SceneTypeDefinition<T>): SceneTypeDefinition<T> {
	return definition;
}
