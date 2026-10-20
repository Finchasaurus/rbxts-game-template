import React from "@rbxts/react";
import { Layer } from "./components/base/layer";
import { ContextualPrompt } from "./components/layouts/contextual-prompt";
import { LoadingScreen } from "./components/layouts/loading-screen";

export function App() {
	return (
		<>
			<Layer key="HUD">
				<ContextualPrompt /></Layer>
			<Layer key="Menu"></Layer>
			<Layer key="World"></Layer>

			<LoadingScreen />
		</>
	);
}
