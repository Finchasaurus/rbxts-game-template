import type { World } from "@rbxts/jecs";
import { Phase } from "@rbxts/planck";
import { Player, PlayerSession } from "shared/components";
import { scheduler } from "shared/core/scheduler";
import { playerDataStore } from "./data";
import { UpdatePlaytime } from "./transformers/playtime";

function DataBindToClose(world: World) {
	game.BindToClose(() => {
		for (const [, player, session] of world.query(Player, PlayerSession)) {
			UpdatePlaytime(player, session);
		}

		playerDataStore.closeAsync();
	});
}
scheduler().addSystem(DataBindToClose, Phase.Startup);
