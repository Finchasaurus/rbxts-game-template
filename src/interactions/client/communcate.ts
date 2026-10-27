import type { World } from "@rbxts/jecs";
import { Prompt } from "components";
import { scheduler } from "core/shared/scheduler";
import { ClientEvents } from "network/client/network";
import { ClientReplicator } from "network/client/replicator";

/**
 * Sends interactions to the server
 *
 * When a player triggers a proximity prompt, the server is told which entity was interacted with.
 * The server then decides what that does (see server/interactions)
 */

/** Fires `Events.gameplay.interact` for each prompt that was triggered this frame */
function CommunicateInteractionSystem(world: World) {
	for (const [buttonId, { event }] of world.query(Prompt)) {
		const serverButtonId = ClientReplicator.get_server_entity(buttonId);
		if (serverButtonId === undefined) {
			continue;
		}

		for (const [,] of event[0]) {
			ClientEvents.gameplay.interact.fire(serverButtonId);
		}
	}
}
scheduler().addSystem(CommunicateInteractionSystem);
