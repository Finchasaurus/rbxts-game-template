import Konsole from "@kyrorblx/konsole";
import jabby, { applets, register } from "@rbxts/jabby";
import type { World } from "@rbxts/jecs";
import { Name } from "@rbxts/jecs";
import { shared } from "@rbxts/replecs";
import { RunService } from "@rbxts/services";
import * as components from "shared/components";
import { SharedComponents } from "shared/components/shared";

export function start(world: World) {
	for (const [name, component] of pairs(components)) {
		if (typeIs(component, "number") === true) {
			world.set(component, Name, name);
		}
	}

	for (const component of SharedComponents) {
		world.add(component, shared);
	}

	const prefix = RunService.IsServer() ? "[SERVER]" : "[CLIENT]";

	register({
		applet: applets.world,
		configuration: {
			world: world,
			get_entity_from_part: (part) => {
				for (const [e, model] of world.query(components.Renderable)) {
					if ((part === model || part.IsDescendantOf(model)) && model.IsA("PVInstance")) {
						return $tuple(e, model);
					}
				}

				for (const [e, group] of world.query(components.RenderableGroup)) {
					for (const [, model] of pairs(group)) {
						if ((part === model || part.IsDescendantOf(model)) && model.IsA("PVInstance")) {
							return $tuple(e, model);
						}
					}
				}
			},
		},
		name: `${prefix} World`,
	});

	jabby.set_check_function((player) => Konsole.getRank(player.UserId) >= 100);
}
