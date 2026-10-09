import { ChildOf, pair, type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { onEvent, Phase } from "@rbxts/planck";
import { CollectionService } from "@rbxts/services";
import { validateTree } from "@rbxts/validate-tree";
import { ServerReplicator } from "server/network/replicator";
import { ServerSettings } from "server/server-settings";
import { Interactable, InteractableTree, Renderable, ServerLoadState } from "shared/components";
import { scheduler } from "shared/core/scheduler";
import type { SceneType } from "./types";
import { SceneTypes } from "./types";

const [hasAddedTagInstances, addedTagInstances] = onEvent(CollectionService.GetInstanceAddedSignal(Tag.Entity));
const [hasRemovedTagInstances, removedTagInstances] = onEvent(CollectionService.GetInstanceRemovedSignal(Tag.Entity));
const tagInstances = CollectionService.GetTagged(Tag.Entity);

function FindParentEntity(instance: Instance) {
	let parent = instance.Parent;

	while (parent?.IsA("DataModel") === false) {
		if (parent.HasTag(Tag.Entity)) {
			return ref(parent);
		}

		parent = parent.Parent;
	}

	return undefined;
}

// Todo: Make it so that entities are linked parent-child so that things like a dorm's card reader can only be read by player who lives in dorm
function BakeEntity(world: World, instance: Instance) {
	if (!instance.HasTag(Tag.Entity)) {
		return;
	}

	const t = instance.GetAttribute<SceneType>("Type");
	if (t === undefined) {
		warn(`Tried to Scene Bake instance: ${instance.GetFullName()} but couldn't find Type attribute.`);
		return;
	}

	const sceneType = SceneTypes[t];
	if (sceneType === undefined) {
		warn(`Tried to Scene Bake instance: ${instance.GetFullName()} of unknown type: ${t}.`);
		return;
	}

	if (validateTree(instance, sceneType.tree) === false) {
		warn(
			`Tried to Scene Bake instance: ${instance.GetFullName()} of type: ${t} but couldn't validate against provided tree.`,
		);
		return;
	}

	const id = ref(instance);

	const insCmp = sceneType.renderable ?? Renderable;

	world.set(id, insCmp, instance);

	ServerReplicator.set_networked(id);

	if (validateTree(instance, InteractableTree)) {
		world.add(id, Interactable);
		ServerReplicator.set_reliable(id, Interactable);
	}

	ServerReplicator.setInstance(id, insCmp);

	// The registry lookup erased the correlation between
	// `tree` and `callback`, so restore it at this boundary.
	sceneType.callback(world, id, instance as never);

	const parentId = FindParentEntity(instance);
	if (parentId !== undefined) {
		world.add(id, pair(ChildOf, parentId));
	}

	return id;
}

const startupQueue = new Array<Instance>();
const additionQueue = new Array<Instance>();

const queued = new Set<Instance>();

let startupComplete = false;

function QueueStartup(instance: Instance) {
	if (queued.has(instance)) {
		return;
	}

	queued.add(instance);
	startupQueue.push(instance);
}

function QueueAddition(instance: Instance) {
	if (queued.has(instance)) {
		return;
	}

	queued.add(instance);
	additionQueue.push(instance);
}

function FindEntitiesToBake() {
	for (const instance of tagInstances) {
		QueueStartup(instance);
	}
}

function CollectAddedEntities() {
	for (const [, instance] of addedTagInstances()) {
		QueueAddition(instance);
	}
}

function BakeEntities(world: World) {
	// ~2ms budget for baking
	const deadline = os.clock() + 0.002;

	while (os.clock() < deadline) {
		const instance = startupQueue.pop();

		if (instance !== undefined) {
			queued.delete(instance);

			if (instance.HasTag(Tag.Entity)) {
				BakeEntity(world, instance);
			}

			continue;
		}

		if (!startupComplete && startupQueue.isEmpty()) {
			startupComplete = true;
			ServerSettings.setLoadState(ServerLoadState.Ready);
		}

		const added = additionQueue.pop();

		if (added === undefined) {
			break;
		}

		queued.delete(added);

		if (added.HasTag(Tag.Entity)) {
			BakeEntity(world, added);
		}
	}
}

function EatEntities(world: World) {
	for (const [, instance] of removedTagInstances()) {
		const instanceId = ref(instance);

		world.delete(instanceId);
		ref.delete(instanceId);
	}
}

scheduler().addSystems([
	{ system: FindEntitiesToBake, phase: Phase.Startup },
	{ system: CollectAddedEntities, runConditions: [hasAddedTagInstances] },
	BakeEntities,
	{ system: EatEntities, runConditions: [hasRemovedTagInstances] },
]);
