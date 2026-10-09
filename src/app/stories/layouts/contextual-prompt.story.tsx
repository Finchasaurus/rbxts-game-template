import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { ContextualPromptView } from "app/components/layouts/contextual-prompt/view";

const controls = {
	actionText: "Open",
	objectText: "Door",
	inputText: "E",
};
const story = CreateReactStory({ controls, react: React, reactRoblox: ReactRoblox }, ({ controls }) => {
	return (
		<ContextualPromptView
			actionText={controls.actionText}
			objectText={controls.objectText}
			inputText={controls.inputText}
		/>
	);
});

export = story;
