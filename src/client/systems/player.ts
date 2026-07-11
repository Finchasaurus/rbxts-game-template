import { type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { Phase } from "@rbxts/planck";
import { CustomHandler } from "@rbxts/replecs";
import { Players } from "@rbxts/services";
import { LocalPlayer, Player } from "shared/components";
import { scheduler } from "shared/core/scheduler";

function MakeLocalPlayer(world: World) {
	const player = ref(Players.LocalPlayer);
	world.set(player, Player, Players.LocalPlayer);
	world.add(player, LocalPlayer);

	world.set(Player, CustomHandler, () => ref(Players.LocalPlayer));
}
scheduler().addSystem(MakeLocalPlayer, Phase.Startup);
