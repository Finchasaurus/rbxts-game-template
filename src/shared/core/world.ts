import jecs from "@rbxts/jecs";
import jecsUtils from "@rbxts/jecs-utils";

import "@rbxts/replecs";
import { RunService } from "@rbxts/services";
import "shared/components";

export function createWorld() {
	const world = jecs.world(RunService.IsStudio());
	jecsUtils.world(world);

	return world;
}
