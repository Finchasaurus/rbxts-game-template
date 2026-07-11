import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { App } from "app/app";
import { ProviderTree } from "app/components/provider-tree";
import { createBasicStoryWorld } from "./util";

const controls = {};

const story = CreateReactStory({ controls, react: React, reactRoblox: ReactRoblox }, () => {
	const { world, entity } = createBasicStoryWorld();

	return (
		<ProviderTree world={world} client={entity}>
			<App />
		</ProviderTree>
	);
});

export = story;
