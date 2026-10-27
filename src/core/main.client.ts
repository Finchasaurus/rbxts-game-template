import "@rbxts/replecs";
import { ReplicatedStorage } from "@rbxts/services";
import { initApp } from "app/root";
import "components";
import { start } from "core/shared/start";
import { createWorld } from "core/shared/world";
import { initProviders } from "providers/shared/providers";

const world = createWorld();

for (const s of [...ReplicatedStorage.shared.GetChildren(), ...ReplicatedStorage.client.GetChildren()]) {
	if (s.IsA("ModuleScript")) {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require(s);
	}
}

initApp(world);
start(world);
initProviders(world);
