import React from "@rbxts/react";
import { Layer } from "app/components/base/layer";
import { Show } from "app/components/base/show";
import { useLoading } from "app/contexts/loading-context";
import { LoadingScreenView } from "./view";

/**
 * The loading screen layer to only render while game is loading
 */
export function LoadingScreen() {
	const isLoading = useLoading();

	return (
		<Show show={isLoading}>
			<Layer key="Loading Screen">
				<LoadingScreenView />
			</Layer>
		</Show>
	);
}
