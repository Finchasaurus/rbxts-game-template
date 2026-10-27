/* eslint-disable @typescript-eslint/no-require-imports */
import Konsole from "@kyrorblx/konsole";
import "@rbxts/replecs";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import "components";
import { start } from "core/shared/start";
import { createWorld } from "core/shared/world";
import { initProviders } from "providers/shared/providers";

const world = createWorld();

Konsole.host();

for (const s of [...ReplicatedStorage.shared.GetDescendants(), ...ServerScriptService.server.GetDescendants()]) {
	if (s.IsA("ModuleScript")) {
		require(s);
	}
}

start(world);
initProviders(world);
