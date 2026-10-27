import { type Entity, type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import type { EvaluateInstanceTree, InstanceTree } from "@rbxts/validate-tree";
import { Triggers } from "components";

/** Runs once for each baked instance of a scene type. `instance` is typed from the scene type's tree. */
export type SceneBakeCallback<T extends InstanceTree> = (
	world: World,
	id: Entity,
	instance: EvaluateInstanceTree<T>,
) => void;

/** How instances of a scene type are baked. */
export interface SceneTypeDefinition<T extends InstanceTree> {
	/** What the instance has to look like, instances that don't match aren't baked. */
	tree: T;
	/** Component the instance is stored in, defaults to Renderable. */
	renderable?: Entity<EvaluateInstanceTree<T>>;
	/** Extra setup for entities of this type. */
	callback: SceneBakeCallback<T>;
	/** Return why an instance must not be baked (skipped with warning) */
	reject?: (instance: EvaluateInstanceTree<T>) => string | undefined;
}

/**
 * The entity of the instance an instance's `Links` attribute points to (an InstanceHandle).
 * Used to connect a button to the thing it triggers.
 */
export function getLinkedEntityFromInstance(
	instance: Instance,
	attribute = Attributes.LinkedEntity,
): Entity | undefined {
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
