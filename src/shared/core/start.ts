import Konsole from "@kyrorblx/konsole";
import jabby, { applets, register } from "@rbxts/jabby";
import type { World } from "@rbxts/jecs";
import { Name } from "@rbxts/jecs";
import { RunService } from "@rbxts/services";
import * as components from "shared/components";
import { registerNetworkProfiles } from "shared/network/profiles";
import { hooked } from "./scheduler";

export function start(world: World, ...containers: Instance[]) {
	for (const [name, component] of pairs(components)) {
		if (typeIs(component, "number") === true) {
			world.set(component, Name, name);
		}
	}

	registerNetworkProfiles(world);

	for (const container of containers) {
		for (const module of container.GetDescendants()) {
			if (module.IsA("ModuleScript") === false) {
				continue;
			}

			const [success] = pcall(require, module);
			if (success === false) {
				warn(`Failed to start module: ${module.GetFullName()}`);
			}
		}
	}

	for (const hook of hooked) {
		hook(world);
	}

	const prefix = RunService.IsServer() ? "[SERVER]" : "[CLIENT]";

	register({
		applet: applets.world,
		configuration: {
			world: world,
			get_entity_from_part: (part) => {
				for (const [e, model] of world.query(components.Renderable)) {
					if ((part === model || part.IsDescendantOf(model)) && model.IsA("PVInstance")) {
						return $tuple(e, model as Part);
					}
				}
			},
		},
		name: `${prefix} World`,
	});

	jabby.set_check_function((player) => Konsole.getRank(player.UserId) >= 100);
}
