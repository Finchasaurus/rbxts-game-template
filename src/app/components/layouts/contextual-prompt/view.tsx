import React from "@rbxts/react";

interface ContextualPromptViewProps {
	actionText: string;
	objectText: string;
	inputText: string;
}

export function ContextualPromptView({ actionText, objectText, inputText }: ContextualPromptViewProps) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 0.9, 0)}
			Size={new UDim2(0, 300, 0, 70)}
			BackgroundTransparency={0.15}
		>
			<textlabel BackgroundTransparency={1} Size={UDim2.fromScale(1, 0.55)} Text={actionText} TextScaled />

			<textlabel
				BackgroundTransparency={1}
				Position={new UDim2(0, 0, 0.55, 0)}
				Size={UDim2.fromScale(1, 0.45)}
				Text={`[${inputText}] ${objectText}`}
				TextScaled
			/>
		</frame>
	);
}
