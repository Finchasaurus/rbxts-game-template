import { type World } from "@rbxts/jecs";
import { ref } from "@rbxts/jecs-utils";
import { onEvent } from "@rbxts/planck";
import { ProximityPromptService, Workspace } from "@rbxts/services";
import { Renderable } from "shared/components";
import { scheduler } from "shared/core/scheduler";

// Only one prompt should be active at once
const indicator = new Instance("Highlight");
indicator.DepthMode = Enum.HighlightDepthMode.Occluded;
indicator.FillTransparency = 1;
indicator.OutlineTransparency = 0;
indicator.Name = "PromptIndicator";
indicator.Enabled = false;
indicator.Parent = Workspace;

const [hasShownIndicators, shownIndicators] = onEvent(ProximityPromptService.PromptShown);
const [hasHiddenIndicators, hiddenIndicators] = onEvent(ProximityPromptService.PromptHidden);

function ApplyHighlightToIndicators(world: World) {
	for (const [, prompt] of shownIndicators()) {
		const promptId = ref.find(prompt);
		if (promptId === undefined) continue;

		const renderable = world.get(promptId, Renderable);
		if (renderable === undefined) {
			continue;
		}

		indicator.OutlineColor = renderable.GetAttribute("Highlight") ?? new Color3(1, 1, 1);
		indicator.Enabled = true;
		indicator.Adornee = renderable;
	}
}
function RemoveHighlightToIndicators(world: World) {
	for (const [, prompt] of hiddenIndicators()) {
		const promptId = ref.find(prompt);
		if (promptId === undefined) continue;

		const renderable = world.get(promptId, Renderable);
		if (renderable === undefined) {
			continue;
		}

		if (indicator.Adornee === renderable) {
			indicator.Enabled = false;
			indicator.Adornee = undefined;
		}
	}
}

scheduler().addSystems([
	{ system: ApplyHighlightToIndicators, runConditions: [hasShownIndicators] },
	{ system: RemoveHighlightToIndicators, runConditions: [hasHiddenIndicators] },
]);
