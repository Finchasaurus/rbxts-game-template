import type { PropsWithChildren } from "@rbxts/react";
import React from "@rbxts/react";
import { Environment } from "@rbxts/ui-labs";
import { Empty } from "./empty";

export function Layer({ children, name }: PropsWithChildren<{ name?: string }>) {
	return Environment.IsStory() ? (
		<Empty key={name}>{children}</Empty>
	) : (
		<screengui key={name} IgnoreGuiInset ResetOnSpawn={false}>
			{children}
		</screengui>
	);
}
