import type { World } from "@rbxts/jecs";
import type { PropsWithChildren } from "@rbxts/react";
import React, { createContext, useContext } from "@rbxts/react";

const WorldContext = createContext<World>(undefined as never);

export function WorldProvider({ world, children }: PropsWithChildren<{ world: World }>) {
	return <WorldContext.Provider value={world}>{children}</WorldContext.Provider>;
}

export function useWorld() {
	return useContext(WorldContext);
}
