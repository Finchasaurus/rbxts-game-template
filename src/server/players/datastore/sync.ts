import type { Entity } from "@rbxts/jecs";
import { type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { Players } from "@rbxts/services";
import { scheduler } from "shared/core/scheduler";
import type { PlayerSaveData } from "./data";
import { pendingDataUpdates } from "./data";
import * as syncers from "./syncers";

export type DataInitializer = (ctx: { world: World; player: Player; playerId: Entity; data: PlayerSaveData }) => void;

function SyncFromStore(world: World) {
	for (const [key, { data, update }] of pendingDataUpdates) {
		const playerUserId = tonumber(key);
		if (playerUserId === undefined) continue;

		const player = Players.GetPlayerByUserId(playerUserId);
		if (player === undefined) continue;

		const playerId = ref(player);

		for (const field of update) {
			syncers[field]({ world, player, playerId, data });
		}
	}

	pendingDataUpdates.clear();
}
scheduler().addSystem({
	system: SyncFromStore,
	runConditions: [() => !pendingDataUpdates.isEmpty()],
});
