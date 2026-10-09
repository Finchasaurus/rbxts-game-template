import type { PropsWithChildren } from "@rbxts/react";
import React from "@rbxts/react";

interface PaddingProps {
	padding: UDim;
}

export function Padding({ padding, children }: PropsWithChildren<PaddingProps>) {
	return (
		<uipadding PaddingBottom={padding} PaddingLeft={padding} PaddingRight={padding} PaddingTop={padding}>
			{children}
		</uipadding>
	);
}
