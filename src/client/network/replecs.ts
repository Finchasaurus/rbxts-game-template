import type { World } from "@rbxts/jecs";
import { collect } from "@rbxts/jecs-utils";
import { Phases } from "@rbxts/planck-runservice";
import { Events } from "client/network/network";
import { ClientReplicator } from "client/network/replicator";
import { scheduler } from "shared/core/scheduler";

/**
 * Applies replication traffic from the server.
 *
 * Collects the remote events and feeds them to the replicator once per frame in Phases.Last so all
 * gameplay systems for the frame have already run.
 */

const [updates] = collect(Events.replecs.sendUpdates);
const [unreliables] = collect(Events.replecs.sendUnreliables);
const [deletions] = collect(Events.replecs.deleteEntity);
const [additions] = collect(Events.replecs.sendEntity);

/** Applies queued replication updates, deletions, and new entities to the world. */
function ReplecsClientSystem(world: World) {
	for (const [, buff, variants] of updates) {
		ClientReplicator.apply_updates(buff, variants);
	}

	for (const [, buff, variants] of unreliables) {
		ClientReplicator.apply_unreliable(buff, variants);
	}

	// The server sends its entity id so translate it to the client's before deleting.
	for (const [, serverEnt] of deletions) {
		const clientEnt = ClientReplicator.get_client_entity(serverEnt);
		if (clientEnt === undefined) continue;

		world.delete(clientEnt);
	}

	for (const [, buff, variants] of additions) {
		ClientReplicator.apply_entity(buff, variants);
	}
}
scheduler().addSystem(ReplecsClientSystem, Phases.Last);
