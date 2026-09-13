import { component, Delete, meta, OnDeleteTarget, pair, tag } from "@rbxts/jecs";
import type { ProfileData } from "server/players/datastore/data";

export const Player = component<Player>();
export const LocalPlayer = tag();

export const OwnedBy = tag();
meta(OwnedBy, pair(OnDeleteTarget, Delete));

export const enum PlayerDataStatus {
	Unloaded,
	Loading,
	Loaded,
	Failed,
}
export const PlayerDataState = component<PlayerDataStatus>();
export const PlayerProfile = component<ProfileData>();
export const PlayerSession = component<number>();

export const Removing = tag();
