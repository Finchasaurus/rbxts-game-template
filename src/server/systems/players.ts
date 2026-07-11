import type { World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { onEvent } from "@rbxts/planck";
import { Players } from "@rbxts/services";
import { applyProfile } from "server/network/profiles";
import { Replicator } from "server/network/replicator";
import { Player } from "shared/components";
import { scheduler } from "shared/core/scheduler";

const [hasNewPlayersEvents, collectNewPlayerEvents] = onEvent(Players.PlayerAdded);
function PlayerAddedSystem(world: World) {
	for (const [, player] of collectNewPlayerEvents()) {
		const playerEntity = ref(player);
		world.set(playerEntity, Player, player);
		applyProfile(playerEntity, "player");
		Replicator.set_custom(playerEntity, Player);
	}
}
scheduler().addSystem({ system: PlayerAddedSystem, runConditions: [hasNewPlayersEvents] });

const [hasLeftPlayersEvents, collectLeftPlayerEvents] = onEvent(Players.PlayerRemoving);
function PlayerRemovingSystem(world: World) {
	for (const [, player] of collectLeftPlayerEvents()) {
		const playerEntity = ref.find(player);
		if (playerEntity !== undefined) {
			world.delete(playerEntity);
			ref.delete(player);
		}
	}
}
scheduler().addSystem({ system: PlayerRemovingSystem, runConditions: [hasLeftPlayersEvents] });
