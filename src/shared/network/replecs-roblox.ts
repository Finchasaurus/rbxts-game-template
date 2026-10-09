// Translated from Luau to Typescript
// Credit: https://github.com/revvy02/replecs-roblox/

import type { Entity, Id, Pair, World } from "@rbxts/jecs";
import { component, IS_PAIR, meta, Name, pair, pair_second } from "@rbxts/jecs";
import { monitor, observer } from "@rbxts/jecs-utils";
import type { Client, Server } from "@rbxts/replecs";
import { serdes, shared } from "@rbxts/replecs";
import { CollectionService } from "@rbxts/services";

const TAG = "replecs-roblox.Instance";
const ATTR = "replecs-roblox.InstanceId";

export const InstanceId = component<number>();
meta(InstanceId, Name, ATTR);
meta(InstanceId, shared);
meta(InstanceId, serdes, {
	bytespan: 4,
	serialize: (id: number) => {
		const b = buffer.create(4);
		buffer.writeu32(b, 0, id);
		return b;
	},
	deserialize: (b: buffer): number => {
		return buffer.readu32(b, 0);
	},
});

export const InstanceProtocol = component();
meta(InstanceProtocol, Name, "replecs-roblox.InstanceProtocol");

type ComponentSet = Set<Id>;

type EntityComponents = Map<Entity, ComponentSet>;

function setupNetworkedInstanceReconciler(world: World) {
	const idToEntityComponents = new Map<number, EntityComponents>();
	const idToInstance = new Map<number, Instance>();
	const instanceToEntityComponents = new Map<Instance, EntityComponents>();

	function ensureMap(id: number) {
		let map = idToEntityComponents.get(id);
		if (map === undefined) {
			map = new Map();
			idToEntityComponents.set(id, map);
		}
		return map;
	}

	function instanceAdded(instance: Instance) {
		const id = instance.GetAttribute<number>(ATTR);
		if (id === undefined) {
			return;
		}

		const map = ensureMap(id);

		idToInstance.set(id, instance);
		instanceToEntityComponents.set(instance, map);

		for (const [e, components] of map) {
			for (const ct of components) {
				world.set(e, ct, instance);
			}
		}
	}

	function instanceRemoved(instance: Instance) {
		const map = instanceToEntityComponents.get(instance);
		if (map === undefined) {
			return;
		}

		for (const [e, components] of map) {
			for (const ct of components) {
				world.remove(e, ct);
			}
		}

		instanceToEntityComponents.delete(instance);
	}

	world.added(InstanceId, (e, p, id) => {
		if (IS_PAIR(p) === false) {
			return;
		}

		const ct = pair_second(world, p as Pair<number, unknown>);
		const map = ensureMap(id);

		let components = map.get(e);
		if (components === undefined) {
			components = new Set<Id>();
			map.set(e, components);
		}
		components.add(ct);

		const instance = idToInstance.get(id);
		if (instance !== undefined) {
			world.set(e, ct, instance);
		}
	});

	world.removed(InstanceId, (e, p, deleting) => {
		if (IS_PAIR(p) === false) {
			return;
		}

		const ct = pair_second(world, p as Pair<number, unknown>);
		const id = world.get(e, p);
		if (id === undefined) {
			return;
		}

		const map = idToEntityComponents.get(id);
		if (map === undefined) {
			return;
		}

		const components = map.get(e);
		if (components === undefined) {
			return;
		}
		components.delete(ct);

		if (components.size() === 0) {
			map.delete(e);
		}

		if (deleting) {
			return;
		}

		// The id pair is the signal that this entity references an instance.
		// When it stops replicating, drop the resolved component. (Client-only:
		// the server never runs this reconciler, so the caller's authoritative
		// component is never touched here.)
		world.remove(e, ct);
	});

	for (const instance of CollectionService.GetTagged(TAG)) {
		instanceAdded(instance);
	}
	CollectionService.GetInstanceAddedSignal(TAG).Connect(instanceAdded);
	CollectionService.GetInstanceRemovedSignal(TAG).Connect(instanceRemoved);
}

export type RbxComponents = {
	instanceId: Id<number>;
	instance: Entity;
};

export type ServerExtension = {
	components: RbxComponents;
	setInstance: (entity: Entity, component: Entity) => void;
	stopInstance: (entity: Entity, component: Entity) => void;
};

export type ClientExtension = {
	components: RbxComponents;
};

export type ExtendedServer = Server & ServerExtension;
export type ExtendedClient = Client & ClientExtension;

export function extendServer(replicator: Server): ExtendedServer {
	const world = replicator.world;
	let nextId = 0;

	function replicateInstance(entity: Entity, component: Entity, instance: Instance) {
		let id = instance.GetAttribute<number>(ATTR);
		const pairId = pair(InstanceId, component);

		if (id === undefined) {
			nextId += 1;
			id = nextId;
			instance.SetAttribute(ATTR, id);
			instance.AddTag(TAG);
		}

		world.set(entity, pairId, id);
		replicator.set_pair(entity, pairId);
	}

	function stopReplicateInstance(entity: Entity, component: Entity, deleting: boolean) {
		const pairId = pair(InstanceId, component);

		// Removing the protocol pair triggers both the InstanceProtocol-removed
		// hook and the component monitor, so teardown can run twice; once the
		// id pair is gone there's nothing left to do.
		if (world.has(entity, pairId) === false) {
			return;
		}

		replicator.stop_pair(entity, pairId);
		if (deleting === false) {
			world.remove(entity, pairId);
		}
	}

	const hookedComponents = new Set<Entity>();

	function ensureComponentHook(component: Entity<Instance>) {
		if (hookedComponents.has(component)) {
			return;
		}
		hookedComponents.add(component);

		const protocolPair = pair(InstanceProtocol, component);

		monitor(world.query(component).with(protocolPair)).removed((e, deleting) => {
			stopReplicateInstance(e, component, deleting);
		});

		observer(world.query(component).with(protocolPair), (e) => {
			replicateInstance(e, component, world.get(e, component)!);
		});
	}

	world.added(InstanceProtocol, (entity, p) => {
		if (IS_PAIR(p) === false) {
			return;
		}

		const component = pair_second(world, p) as Entity<Instance>;
		ensureComponentHook(component);

		const existing = world.get(entity, component);
		if (existing !== undefined) {
			replicateInstance(entity, component, existing);
		}
	});
	world.removed(InstanceProtocol, (entity, p, deleting) => {
		if (IS_PAIR(p) === false) {
			return;
		}

		const component = pair_second(world, p) as Entity<Instance>;
		stopReplicateInstance(entity, component, deleting === true);
	});

	const extended = replicator as ExtendedServer;

	extended.components.instanceId = InstanceId;
	extended.components.instance = InstanceProtocol;
	extended.setInstance = (entity, component) => {
		world.add(entity, pair(InstanceProtocol, component));
	};
	extended.stopInstance = (entity, component) => {
		stopReplicateInstance(entity, component, false);
		world.remove(entity, pair(InstanceProtocol, component));
	};

	return extended;
}

export function extendClient(replicator: Client): ExtendedClient {
	setupNetworkedInstanceReconciler(replicator.world);

	const extended = replicator as ExtendedClient;
	extended.components.instanceId = InstanceId;
	extended.components.instance = InstanceProtocol;

	return extended;
}
