import type { PropsWithChildren } from "@rbxts/react";
import React from "@rbxts/react";
import { transform } from "app/util/transform";
import type { PropsWithNativeExcept } from "types/react";

export function Empty({
	children,
	native,
	debug,
}: PropsWithNativeExcept<Frame, "Transparency" | "BackgroundTransparency", PropsWithChildren<{ debug?: boolean }>>) {
	return (
		<frame
			Transparency={debug ? 0.5 : 1}
			Size={transform.size.fill}
			Position={transform.position.center.center}
			AnchorPoint={transform.anchor.center.center}
			{...native}
		>
			{children}
		</frame>
	);
}
