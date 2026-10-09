import type { World } from "@rbxts/jecs";
import { Events } from "client/network/network";
import { ClientReplicator } from "client/network/replicator";
import { Prompt } from "shared/components";
import { scheduler } from "shared/core/scheduler";

function CommunicateInteraction(world: World) {
	for (const [buttonId, { event }] of world.query(Prompt)) {
		const serverButtonId = ClientReplicator.get_server_entity(buttonId);
		if (serverButtonId === undefined) {
			continue;
		}

		for (const [,] of event[0]) {
			Events.gameplay.interact.fire(serverButtonId);
		}
	}
}
scheduler().addSystem(CommunicateInteraction);
