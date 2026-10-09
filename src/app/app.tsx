import React from "@rbxts/react";
import { Layer } from "./components/base/layer";
import { LoadingScreen } from "./components/layouts/loading-screen/loading";

export function App() {
	return (
		<>
			<Layer key="HUD"></Layer>
			<Layer key="Menu"></Layer>
			<Layer key="World"></Layer>

			<LoadingScreen />
		</>
	);
}
