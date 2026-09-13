import type { World } from "@rbxts/jecs";
import { timePassed } from "@rbxts/planck";
import { Player, PlayerSession, Removing } from "shared/components";
import { scheduler } from "shared/core/scheduler";
import { UpdatePlaytime } from "./datastore/transformers/playtime";

// Just for studio testing
const PlaytimeUpdateInterval = timePassed(1);
const PlaytimeSaveInterval = timePassed(60);

function MakePlayerSession(world: World) {
	for (const [playerId] of world.query(Player).without(PlayerSession)) {
		world.set(playerId, PlayerSession, 0);
	}
}

function UpdateSessionPlaytime(world: World) {
	const dt = scheduler().getDeltaTime();

	for (const [playerId, session] of world.query(PlayerSession)) {
		world.set(playerId, PlayerSession, session + dt);
	}
}

function SavePlaytimeOnTimer(world: World) {
	for (const [, player, session] of world.query(Player, PlayerSession)) {
		UpdatePlaytime(player, session);
	}
}

function SavePlaytimeOnLeave(world: World) {
	for (const [, player, session] of world.query(Player, PlayerSession, Removing)) {
		UpdatePlaytime(player, session).catch((err) => {
			if (err !== "Store is clsoed") {
				throw err;
			}
		});
	}
}

scheduler().addSystems([
	MakePlayerSession,
	{ system: UpdateSessionPlaytime, runConditions: [PlaytimeUpdateInterval] },
	{ system: SavePlaytimeOnTimer, runConditions: [PlaytimeSaveInterval] },
	SavePlaytimeOnLeave,
]);
