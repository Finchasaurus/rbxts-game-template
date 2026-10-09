import type { World } from "@rbxts/jecs";
import { collect, ref } from "@rbxts/jecs-utils";
import { validateTree } from "@rbxts/validate-tree";
import { Interactable, InteractableTree, Prompt, Renderable } from "shared/components";
import { scheduler } from "shared/core/scheduler";

const BASE_ACTION_TEXT = "Interact";
const BASE_OBJECT_TEXT = "";
const BASE_HOLD_DURATION = 0;
const BASE_ACTIVATION_DIST = 10;

function ManagePromptsForInteractables(world: World) {
	for (const [id, instance] of world.query(Renderable, Interactable).without(Prompt)) {
		if (validateTree(instance, InteractableTree) === false) {
			warn(`Scene Entity has Interactable but doesn't conform to tree: ${instance.GetFullName()}`);
			continue;
		}

		const prompt = new Instance("ProximityPrompt");
		prompt.ActionText = instance.GetAttribute("ActionText") ?? BASE_ACTION_TEXT;
		prompt.ObjectText = instance.GetAttribute("ObjectText") ?? BASE_OBJECT_TEXT;
		prompt.HoldDuration = instance.GetAttribute("HoldDuration") ?? BASE_HOLD_DURATION;
		prompt.MaxActivationDistance = instance.GetAttribute("ActivationDist") ?? BASE_ACTIVATION_DIST;
		prompt.ClickablePrompt = false;
		prompt.KeyboardKeyCode = Enum.KeyCode.E;
		prompt.Style = Enum.ProximityPromptStyle.Custom;
		prompt.Exclusivity = Enum.ProximityPromptExclusivity.OneGlobally;
		prompt.Parent = instance.Prompt;

		world.set(id, Prompt, {
			prompt,
			event: collect(prompt.TriggerEnded),
		});

		ref.set(prompt, id);
	}

	for (const [id, prompt] of world.query(Prompt).without(Interactable)) {
		prompt.prompt.Destroy();
		world.remove(id, Prompt);
	}
}
scheduler().addSystem(ManagePromptsForInteractables);
