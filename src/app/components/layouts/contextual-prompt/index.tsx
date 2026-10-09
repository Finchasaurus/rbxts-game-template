import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { ProximityPromptService } from "@rbxts/services";
import { ContextualPromptView } from "./view";

export function ContextualPrompt() {
	const [prompt, setPrompt] = useState<ProximityPrompt>();

	useMountEffect(() => {
		const shown = ProximityPromptService.PromptShown.Connect((prompt) => {
			setPrompt(prompt);
		});

		const hidden = ProximityPromptService.PromptHidden.Connect((prompt) => {
			setPrompt((current) => (current === prompt ? undefined : current));
		});

		return () => {
			shown.Disconnect();
			hidden.Disconnect();
		};
	});

	if (!prompt) {
		return <></>;
	}

	return (
		<ContextualPromptView
			actionText={prompt.ActionText}
			objectText={prompt.ObjectText}
			inputText={prompt.KeyboardKeyCode.Name}
		/>
	);
}
