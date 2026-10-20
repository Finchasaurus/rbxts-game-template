import type { World } from "@rbxts/jecs";
import type { ServerLoadState } from "shared/components";
import { GameServerSettings } from "shared/components";
import { ServerReplicator } from "./network/replicator";

/**
 * Stored on the GameServerSettings component, which is its own entity and is replicated to every client.
 */

/** Use after init(world) has been called. */
export namespace ServerSettingsProvider {
	let world: World;
	export function init(w: World) {
		world = w;

		ServerReplicator.set_networked(GameServerSettings);
		ServerReplicator.set_reliable(GameServerSettings, GameServerSettings);
	}

	export function getLoadState() {
		return world.get(GameServerSettings, GameServerSettings)!;
	}

	export function setLoadState(loadState: ServerLoadState) {
		world.set(GameServerSettings, GameServerSettings, { ...getLoadState(), ServerLoadStatus: loadState });
	}
}
