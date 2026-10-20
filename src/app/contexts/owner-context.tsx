import type { Entity } from "@rbxts/jecs";
import type { PropsWithChildren } from "@rbxts/react";
import React, { createContext, useContext } from "@rbxts/react";

const ClientContext = createContext<Entity>(undefined as never);

/**
 * Gives React components the entity of the local player
 *
 * Passed through a context instead of reference due to story mocking
 */
export function ClientProvider({ client, children }: PropsWithChildren<{ client: Entity }>) {
	return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

/**
 * @returns The entity of the local player
 */
export function useClient() {
	return useContext(ClientContext);
}
