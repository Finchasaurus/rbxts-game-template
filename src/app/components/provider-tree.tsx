import type { Entity, World } from "@rbxts/jecs";
import type { PropsWithChildren } from "@rbxts/react";
import React from "@rbxts/react";
import { ClientProvider } from "app/contexts/owner-context";
import { WorldProvider } from "app/contexts/world-context";

export function ProviderTree({ children, world, client }: PropsWithChildren<{ world: World; client: Entity }>) {
	return (
		<WorldProvider world={world}>
			<ClientProvider client={client}>{children}</ClientProvider>
		</WorldProvider>
	);
}
