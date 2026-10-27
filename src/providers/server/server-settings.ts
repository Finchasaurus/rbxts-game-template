import type { World } from "@rbxts/jecs";
import type { ServerLoadState } from "components";
import { GameServerSettings } from "components";
import { ServerReplicator } from "network/server/replicator";
import { registerProvider } from "providers/shared/providers";

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
		assert(world !== undefined, "ServerSettingsProvider has not been initialized");
		return world.get(GameServerSettings, GameServerSettings)!;
	}

	export function setLoadState(loadState: ServerLoadState) {
		assert(world !== undefined, "ServerSettingsProvider has not been initialized");
		world.set(GameServerSettings, GameServerSettings, { ...getLoadState(), ServerLoadStatus: loadState });
	}
}

registerProvider(ServerSettingsProvider);
