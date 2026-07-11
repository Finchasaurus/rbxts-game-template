import { backend } from "@rbxts/react-devtools-core";
import ReactGlobals from "@rbxts/react-globals";
import { Players, RunService } from "@rbxts/services";

if (RunService.IsStudio()) {
	ReactGlobals.__DEV__ = true;
	ReactGlobals.__PROFILE__ = true;

	backend.connectToDevtools();
}

import type { World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { App } from "./app";
import { ProviderTree } from "./components/provider-tree";

export function initApp(world: World) {
	const root = createRoot(new Instance("Folder"));
	const container = Players.LocalPlayer.PlayerGui;
	root.render(
		<StrictMode>
			{createPortal(
				<ProviderTree world={world} client={ref(Players.LocalPlayer)}>
					<App />
				</ProviderTree>,
				container,
			)}
		</StrictMode>,
	);

	const loadingScreen = container.FindFirstChild("LoadingScreenPlaceholder");
	loadingScreen?.Destroy();
}
