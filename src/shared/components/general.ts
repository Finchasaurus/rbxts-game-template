import { component, IsA, meta, pair, tag } from "@rbxts/jecs";
import { replicatedComponent } from "./util";

export const Timer = component<number>();
export const Clock = component<number>();

export const TimerExpired = tag();

export const enum ServerLoadState {
	Loading,
	Ready,
}

export const GameServerSettings = replicatedComponent<{
	ServerLoadStatus: ServerLoadState;
}>();
meta(GameServerSettings, GameServerSettings, {
	ServerLoadStatus: ServerLoadState.Loading,
});
