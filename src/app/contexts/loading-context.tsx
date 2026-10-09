import type { PropsWithChildren } from "@rbxts/react";
import React, { createContext, useContext, useEffect, useState } from "@rbxts/react";
import { useGetComponent } from "app/hooks/use-get-component";
import { GameServerSettings, ServerLoadState } from "shared/components";

const LoadingContext = createContext<boolean>(false);

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

	const loading =
		forceScreen &&
		(!gameLoaded || gameSettings === undefined || gameSettings.ServerLoadStatus !== ServerLoadState.Ready);

	return <LoadingContext.Provider value={loading}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
	return useContext(LoadingContext);
}
