import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Boolean, CreateReactStory } from "@rbxts/ui-labs";
import { App } from "app/app";
import { ProviderTree } from "app/components/provider-tree";
import { createBasicStoryWorld } from "./util";

const controls = {
	Loading: Boolean(false),
};

const story = CreateReactStory({ controls, react: React, reactRoblox: ReactRoblox }, (props) => {
	const { world, entity } = createBasicStoryWorld();

	return (
		<ProviderTree world={world} client={entity} loading={props.controls.Loading}>
			<App />
		</ProviderTree>
	);
});

export = story;
