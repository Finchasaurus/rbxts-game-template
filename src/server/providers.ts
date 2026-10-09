import type { World } from "@rbxts/jecs";
import { ServerSettingsProvider } from "./server-settings";

export function initProviders(world: World) {
	ServerSettingsProvider.init(world);
}
