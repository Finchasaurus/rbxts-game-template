import type { World } from "@rbxts/jecs";
import { monitor, ref } from "@rbxts/jecs-utils";
import { Phase } from "@rbxts/planck";
import { Renderable } from "shared/components";
import { scheduler } from "shared/core/scheduler";

function MakeBindings(world: World) {
	const monitorRenderable = monitor(world.query(Renderable));
	monitorRenderable.added((e) => {
		const r = world.get(e, Renderable);
		if (r === undefined) {
			return;
		}

		ref.set(r, e);
	});

	monitorRenderable.removed((e) => {
		const r = world.get(e, Renderable);
		if (r === undefined) {
			return;
		}

		ref.delete(r);
	});
}
scheduler().addSystem(MakeBindings, Phase.Startup);
