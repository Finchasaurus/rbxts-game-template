import type { PropsWithChildren } from "@rbxts/react";
import React, { createContext, useContext, useEffect, useState } from "@rbxts/react";
import { useGetComponent } from "app/hooks/use-get-component";
import { GameServerSettings, ServerLoadState } from "components";

const LoadingContext = createContext<boolean>(false);

/**
 * Whether the loading screen should be shown
 *
 * True until the game has loaded and the server reports it as Ready.
 *
 * @param forceScreen false skips the wait (stories)
 */
export function LoadingProvider({ forceScreen = true, children }: PropsWithChildren<{ forceScreen?: boolean }>) {
	const [gameLoaded, setGameLoaded] = useState(game.IsLoaded());

	const gameSettings = useGetComponent(GameServerSettings, GameServerSettings);

	useEffect(() => {
		if (!forceScreen || game.IsLoaded()) {
			setGameLoaded(true);
			return;
		}

		const connection = game.Loaded.Connect(() => {
			setGameLoaded(true);
		});

		return () => connection.Disconnect();
	}, [forceScreen]);

	// Wait for game to load, for server settings to replicate, and for server to be ready
	const loading =
		forceScreen &&
		(!gameLoaded || gameSettings === undefined || gameSettings.ServerLoadStatus !== ServerLoadState.Ready);

	return <LoadingContext.Provider value={loading}>{children}</LoadingContext.Provider>;
}

/**
 * @returns Whether the loading screen should be shown
 */
export function useLoading() {
	return useContext(LoadingContext);
}
