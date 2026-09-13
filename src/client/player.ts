import { type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { Phase } from "@rbxts/planck";
import { CustomHandler } from "@rbxts/replecs";
import { Players } from "@rbxts/services";
import { LocalPlayer, Player } from "shared/components";
import { scheduler } from "shared/core/scheduler";

function RegisterLocalPlayer(world: World) {
	const player = Players.LocalPlayer;
	const playerId = ref(player);

	world.set(playerId, Player, player);
	world.add(playerId, LocalPlayer);

	world.set(Player, CustomHandler, (player: Player) => ref(player));
}
scheduler().addSystem(RegisterLocalPlayer, Phase.Startup);
