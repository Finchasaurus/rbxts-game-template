import type { Entity } from "@rbxts/jecs";
import type { PropsWithChildren } from "@rbxts/react";
import React, { createContext, useContext } from "@rbxts/react";

const ClientContext = createContext<Entity>(undefined as never);

export function ClientProvider({ client, children }: PropsWithChildren<{ client: Entity }>) {
	return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

export function useClient() {
	return useContext(ClientContext);
}
