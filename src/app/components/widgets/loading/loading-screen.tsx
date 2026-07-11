import React from "@rbxts/react";
import { transform } from "app/util/transform";

export function LoadingScreen() {
	return <frame BackgroundColor3={new Color3(1, 0, 1)} Size={transform.size.fill}></frame>;
}
