import type { World } from "@rbxts/jecs";
import { Workspace } from "@rbxts/services";
import { Player, PlayerDataState, PlayerDataStatus } from "shared/components";
import { scheduler } from "shared/core/scheduler";
import { playerDataStore } from "./data";

async function loadPlayerData(player: Player) {
	await playerDataStore.load(player);

	await playerDataStore.update(player, (data) => {
		const now = Workspace.GetServerTimeNow();

		if (data.profile.firstJoin === 0) {
			data.profile.firstJoin = now;
		}

		data.profile.lastLogin = now;

		return true;
	});
}

function LoadPlayerData(world: World) {
	for (const [playerId, player, state] of world.query(Player, PlayerDataState)) {
		if (state !== PlayerDataStatus.Unloaded) continue;

		world.set(playerId, PlayerDataState, PlayerDataStatus.Loading);

		loadPlayerData(player)
			.then(() => {
				// Entity may have been destroyed while we were loading
				if (!world.has(playerId, Player, PlayerDataState)) return;
				if (world.get(playerId, Player) !== player) return;

				world.set(playerId, PlayerDataState, PlayerDataStatus.Loaded);
			})
			.catch((err) => {
				if (!world.has(playerId, Player, PlayerDataState)) return;
				if (world.get(playerId, Player) !== player) return;

				world.set(playerId, PlayerDataState, PlayerDataStatus.Failed);

				warn(`Failed to load data for ${player.Name}:`, err);

				player.Kick(`There was a problem loading your data:\n${err}`);
			});
	}

	for (const [playerId] of world.query(Player).without(PlayerDataState)) {
		world.set(playerId, PlayerDataState, PlayerDataStatus.Unloaded);
	}
}
scheduler().addSystem(LoadPlayerData);
