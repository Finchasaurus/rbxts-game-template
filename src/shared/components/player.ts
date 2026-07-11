import { component, Delete, meta, OnDeleteTarget, pair, tag } from "@rbxts/jecs";

export const Player = component<Player>();
export const LocalPlayer = tag();

export const OwnedBy = tag();
meta(OwnedBy, pair(OnDeleteTarget, Delete));
