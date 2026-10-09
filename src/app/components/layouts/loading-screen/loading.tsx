import React from "@rbxts/react";
import { Layer } from "app/components/base/layer";
import { useLoading } from "app/contexts/loading-context";
import { LoadingScreenView } from "./view";

export function LoadingScreen() {
	const isLoading = useLoading();

	return (
		isLoading && (
			<Layer key="Loading Screen">
				<LoadingScreenView />
			</Layer>
		)
	);
}
