import type { World } from "@rbxts/jecs";
import { timePassed } from "@rbxts/planck";
import { Player, PlayerSession, Removing } from "shared/components";
import { scheduler } from "shared/core/scheduler";
import { UpdatePlaytime } from "./datastore/transformers/playtime";

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
		UpdatePlaytime(player, session).catch((err: string) => {
			if (err !== "Store is clsoed") {
				throw err;
			}
		});
	}
}

scheduler().addSystems([
	MakePlayerSession,
	UpdateSessionPlaytime,
	{ system: SavePlaytimeOnTimer, runConditions: [PlaytimeSaveInterval] },
	SavePlaytimeOnLeave,
]);
