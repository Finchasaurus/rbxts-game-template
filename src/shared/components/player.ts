import { component, Delete, meta, OnDeleteTarget, pair, tag } from "@rbxts/jecs";
import type { EmployeeRank, ProfileData } from "server/players/datastore/data";
import { replicatedComponent } from "./util";

/** Components that describe a player entity and their saved data. */

/** The Roblox Player a player entity represents (replicated, resolved to the same entity on the client with `ref`). */
export const Player = replicatedComponent<Player>();
/** @client tags the entity of the local player. */
export const LocalPlayer = tag();

/** `pair(OwnedBy, owner)` on an owned entity (e.g. a dorm). Deleting the owner also deletes everything it owns. */
export const OwnedBy = tag();
meta(OwnedBy, pair(OnDeleteTarget, Delete));
/** `pair(Owns, owned)` on the owner. Mirror of OwnedBy. */
export const Owns = tag();

export const enum PlayerDataStatus {
	Unloaded,
	Loading,
	Loaded,
	Failed,
}
export const PlayerDataState = component<PlayerDataStatus>();
export const PlayerProfile = component<ProfileData>();
/** Seconds the player has been in this server (server/players/playtime.ts). */
export const PlayerSession = component<number>();

export const Removing = tag();


// Roblox parties (6 max)
export const PlayerParty = component<string>();
