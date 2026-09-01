import jecs from "@rbxts/jecs";
import jecsUtils from "@rbxts/jecs-utils";

import "@rbxts/replecs";
import { RunService } from "@rbxts/services";
import { Environment } from "@rbxts/ui-labs";
import "shared/components";
import { initReplicator } from "shared/network/replicator";
import { initScheduler } from "./scheduler";

export function createWorld() {
	const world = jecs.world(RunService.IsStudio());
	jecsUtils.world(world);

	if (!Environment.IsStory()) {
		initReplicator(world);
		initScheduler(world);
	}

	return world;
}
