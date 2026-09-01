import type { World } from "@rbxts/jecs";
import { collect } from "@rbxts/jecs-utils";
import { Phases } from "@rbxts/planck-runservice";
import { Events } from "client/network/network";
import { Replicator } from "client/network/replicator";
import { scheduler } from "shared/core/scheduler";

const [updates] = collect(Events.replecs.sendUpdates);
const [unreliables] = collect(Events.replecs.sendUnreliables);
const [deletions] = collect(Events.replecs.deleteEntity);
const [additions] = collect(Events.replecs.sendEntity);

function ReplecsClientSystem(world: World) {
	for (const [, buff, variants] of updates) {
		Replicator.apply_updates(buff, variants);
	}

	for (const [, buff, variants] of unreliables) {
		Replicator.apply_unreliable(buff, variants);
	}

	for (const [, serverEnt] of deletions) {
		const clientEnt = Replicator.get_client_entity(serverEnt);
		if (clientEnt === undefined) continue;

		world.delete(clientEnt);
	}

	for (const [, buff, variants] of additions) {
		Replicator.apply_entity(buff, variants);
	}
}
scheduler().addSystem(ReplecsClientSystem, Phases.Last);
