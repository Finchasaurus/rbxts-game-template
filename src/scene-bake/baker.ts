import { ChildOf, pair, type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { onEvent, Phase } from "@rbxts/planck";
import { CollectionService } from "@rbxts/services";
import { validateTree } from "@rbxts/validate-tree";
import { Interactable, InteractableTree, ServerLoadState } from "components";
import { Renderable } from "components/util";
import { scheduler } from "core/shared/scheduler";
import { ServerReplicator } from "network/server/replicator";
import ServerSettingsProvider from "providers/server/server-settings";
import type { SceneType } from "./types";
import { SceneTypes } from "./types";

/**
 * Turns instances tagged `Entity` into ECS entities.
 * The instance's `Type` attribute picks the scene type from types/ that decides what the instance should look like
 * and any extra setup it needs.
 * Instances that exist at startup are baked first, then the ones added later.
 * Once the startup ones are done the server is marked Ready,which lets clients drop their loading screen.
 * Destorying an instance (or removing tag) deletes the entity.
 */

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

function BakeEntity(world: World, instance: Instance) {
	if (!instance.HasTag(Tag.Entity)) {
		return;
	}

	const t = instance.GetAttribute<SceneType>(Attributes.SceneType);
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

	const rejection = sceneType.reject?.(instance as never);
	if (rejection !== undefined) {
		warn(`Refused to Scene Bake instance: ${instance.GetFullName()} of type: ${t}: ${rejection}`);
		return;
	}

	const id = ref(instance);

	const insCmp = sceneType.renderable ?? Renderable;

	world.set(id, insCmp, instance);

	ServerReplicator.set_networked(id);

	// Anything with a Prompt attachment can be interacted with. Clients make the prompt.
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

// Instances waiting to be baked. Startup ones go first, `queued` stops one from being queued twice.
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

/** Bakes queued instances, a little each frame so a large scene doesn't stall the server. */
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

		// Everything from startup is baked: tell clients the server is ready.
		if (!startupComplete && startupQueue.isEmpty()) {
			startupComplete = true;
			ServerSettingsProvider.setLoadState(ServerLoadState.Ready);
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
