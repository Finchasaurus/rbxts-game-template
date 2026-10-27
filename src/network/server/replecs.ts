import { interval } from "@rbxts/jecs-utils";
import { Phases } from "@rbxts/planck-runservice";
import { scheduler } from "core/shared/scheduler";
import { ServerEvents } from "./network";
import { ServerReplicator } from "./replicator";

/**
 * Sends replication traffic to clients.
 *
 * Updates are collected from server replicator and send at a fixed rate instead of every frame to save bandwidth.
 */

const updatesInterval = interval(1 / 20);
const unreliablesInterval = interval(1 / 30);

function ReplecsServerSystem() {
	if (updatesInterval()) {
		for (const [player, buff, variants] of ServerReplicator.collect_updates()) {
			ServerEvents.replecs.sendUpdates.fire(player, buff, variants);
		}
	}

	if (unreliablesInterval()) {
		for (const [player, buff, variants] of ServerReplicator.collect_unreliable()) {
			ServerEvents.replecs.sendUnreliables.fire(player, buff, variants);
		}
	}
}
scheduler().addSystem(ReplecsServerSystem, Phases.Last);
