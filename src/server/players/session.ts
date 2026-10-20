import type { World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { onEvent } from "@rbxts/planck";
import { Phases } from "@rbxts/planck-runservice";
import { Players } from "@rbxts/services";
import { ServerReplicator } from "server/network/replicator";
import { Player, PlayerParty, Removing } from "shared/components";
import { scheduler } from "shared/core/scheduler";

/**
 * Le player entity lifecyccle
 *
 * A player id is created when a player joins and gets what the game needs on a player (stamina, party, etc)
 * When they leave it is tagged Removing for a frame so other systems can React (e.g. save data) and then is deleted.
 */

const [hasNewPlayersEvents, collectNewPlayerEvents] = onEvent(Players.PlayerAdded);
function PlayerAddedSystem(world: World) {
	for (const [, player] of collectNewPlayerEvents()) {
		const playerId = ref(player);

		world.set(playerId, Player, player);

		// Players that join together form a party
		const partyId = player.PartyId;
		if (partyId !== "") {
			world.set(playerId, PlayerParty, partyId);
		}

		ServerReplicator.set_networked(playerId);
		ServerReplicator.set_reliable(playerId, Player);
		ServerReplicator.set_custom(playerId, Player);
	}
}

const [hasLeftPlayersEvents, collectLeftPlayerEvents] = onEvent(Players.PlayerRemoving);
function PlayerRemovingSystem(world: World) {
	for (const [, player] of collectLeftPlayerEvents()) {
		const playerId = ref.find(player);
		if (playerId === undefined) continue;
		world.add(playerId, Removing);
	}
}

function RemovePlayerEntitySystem(world: World) {
	for (const [playerId, player] of world.query(Player, Removing)) {
		world.delete(playerId);
		ref.delete(player);
	}
}

scheduler().addSystems([
	{ system: PlayerAddedSystem, runConditions: [hasNewPlayersEvents] },
	{ system: PlayerRemovingSystem, runConditions: [hasLeftPlayersEvents] },
	{ system: RemovePlayerEntitySystem, phase: Phases.Last },
]);
