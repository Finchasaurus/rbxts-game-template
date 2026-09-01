import { interval } from "@rbxts/jecs-utils";
import { Phases } from "@rbxts/planck-runservice";
import { Events } from "server/network/network";
import { Replicator } from "server/network/replicator";
import { scheduler } from "shared/core/scheduler";

const updatesInterval = interval(1 / 20);
const unreliablesInterval = interval(1 / 30);

function ReplecsServerSystem() {
	if (updatesInterval()) {
		for (const [player, buff, variants] of Replicator.collect_updates()) {
			Events.replecs.sendUpdates.fire(player, buff, variants);
		}
	}

	if (unreliablesInterval()) {
		for (const [player, buff, variants] of Replicator.collect_unreliable()) {
			Events.replecs.sendUnreliables.fire(player, buff, variants);
		}
	}
}
scheduler().addSystem(ReplecsServerSystem, Phases.Last);
