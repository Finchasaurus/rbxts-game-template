import type { World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { onEvent } from "@rbxts/planck";
import { Phases } from "@rbxts/planck-runservice";
import { Players } from "@rbxts/services";
import { ServerReplicator } from "server/network/replicator";
import { Player, Removing } from "shared/components";
import { scheduler } from "shared/core/scheduler";

const [hasNewPlayersEvents, collectNewPlayerEvents] = onEvent(Players.PlayerAdded);
function PlayerAddedSystem(world: World) {
	for (const [, player] of collectNewPlayerEvents()) {
		const playerId = ref(player);

		world.set(playerId, Player, player);

		ServerReplicator.set_networked(playerId);
		ServerReplicator.set_reliable(playerId, Player);
		ServerReplicator.set_custom(playerId, Player);
	}
}

const [hasLeftPlayersEvents, collectLeftPlayerEvents] = onEvent(Players.PlayerRemoving);
function PlayerRemovingSystem(world: World) {
	for (const [, player] of collectLeftPlayerEvents()) {
		const playerId = ref.find(player);
		if (playerId !== undefined) {
			world.add(playerId, Removing);
		}
	}
}

function RemovePlayerEntity(world: World) {
	for (const [playerId, player] of world.query(Player, Removing)) {
		world.delete(playerId);
		ref.delete(player);
	}
}

scheduler().addSystems([
	{ system: PlayerAddedSystem, runConditions: [hasNewPlayersEvents] },
	{ system: PlayerRemovingSystem, runConditions: [hasLeftPlayersEvents] },
	{ system: RemovePlayerEntity, phase: Phases.Last },
]);
