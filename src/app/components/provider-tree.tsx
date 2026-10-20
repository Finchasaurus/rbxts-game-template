import type { Entity, World } from "@rbxts/jecs";
import type { PropsWithChildren } from "@rbxts/react";
import React from "@rbxts/react";
import { LoadingProvider } from "app/contexts/loading-context";
import { ClientProvider } from "app/contexts/owner-context";
import { WorldProvider } from "app/contexts/world-context";

/**
 * Provides what the UI needs
 *
 * @param world the ECS world
 * @param client the local player's entity (passed through for stories)
 * @param loading forces the loading screen on/off used in stories
 */
export function ProviderTree({
	children,
	world,
	client,
	loading,
}: PropsWithChildren<{ world: World; client: Entity; loading?: boolean }>) {
	return (
		<WorldProvider world={world}>
			<ClientProvider client={client}>
				<LoadingProvider forceScreen={loading}>{children}</LoadingProvider>
			</ClientProvider>
		</WorldProvider>
	);
}
