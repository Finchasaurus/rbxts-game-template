import React from "@rbxts/react";
import { Layer } from "app/components/base/layer";
import { useLoading } from "app/hooks/use-loading";
import { LoadingScreen } from "./loading-screen";

export function Loading() {
	const isLoading = useLoading();

	return (
		isLoading && (
			<Layer key="Loading Screen">
				<LoadingScreen />
			</Layer>
		)
	);
}
