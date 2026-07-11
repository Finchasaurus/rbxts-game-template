import React from "@rbxts/react";
import { Layer } from "./components/base/layer";
import { Loading } from "./components/widgets/loading/loading";

export function App() {
	return (
		<>
			<Layer key="HUD"></Layer>
			<Layer key="Menu"></Layer>
			<Layer key="World"></Layer>

			<Loading />
		</>
	);
}
