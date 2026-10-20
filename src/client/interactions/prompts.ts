import type { World } from "@rbxts/jecs";
import { collect, ref } from "@rbxts/jecs-utils";
import { validateTree } from "@rbxts/validate-tree";
import { Interactable, InteractableTree, Prompt } from "shared/components";
import { Renderable } from "shared/components/util";
import { scheduler } from "shared/core/scheduler";

/**
 * Proximity prompts for interactable entities.
 *
 * Every replicated entity with the Interactable tag gets a ProximityPrompt parented to its Prompt attachment
 * The prompt is only a trigger: the UI is drawn by the React ContextualPrompt and the outline by highlight-interaction.ts.
 * Prompts are removed again when the entity stops being Interactable (e.g. an item that was picked up).
 */

const BASE_ACTION_TEXT = "Interact";
const BASE_OBJECT_TEXT = "";
const BASE_HOLD_DURATION = 0;
const BASE_ACTIVATION_DIST = 10;

/** Creates prompts for the new interactables and destroys the prompts of entities that stopped being interactable */
function ManagePromptsForInteractablesSystem(world: World) {
	for (const [id, instance] of world.query(Renderable, Interactable).without(Prompt)) {
		if (validateTree(instance, InteractableTree) === false) {
			warn(`Scene Entity has Interactable but doesn't conform to tree: ${instance.GetFullName()}`);
			continue;
		}

		const prompt = new Instance("ProximityPrompt");
		prompt.ActionText = instance.GetAttribute(Attributes.PromptActionText) ?? BASE_ACTION_TEXT;
		prompt.ObjectText = instance.GetAttribute(Attributes.PromptObjectText) ?? BASE_OBJECT_TEXT;
		prompt.HoldDuration = instance.GetAttribute(Attributes.PromptHoldDuration) ?? BASE_HOLD_DURATION;
		prompt.MaxActivationDistance = instance.GetAttribute(Attributes.PrompActivateDist) ?? BASE_ACTIVATION_DIST;
		prompt.ClickablePrompt = false;
		prompt.KeyboardKeyCode = Enum.KeyCode.E;
		prompt.Style = Enum.ProximityPromptStyle.Custom;
		prompt.Exclusivity = Enum.ProximityPromptExclusivity.OneGlobally;
		prompt.Parent = instance.Prompt;

		// TriggerEnded events are collected so CommunicateInteraction can read them each frame
		world.set(id, Prompt, {
			prompt,
			event: collect(prompt.TriggerEnded),
		});

		// Lets us go from a prompt instance back to its entity
		ref.set(prompt, id);
	}

	// No longer interactable so cleanup
	for (const [id, prompt] of world.query(Prompt).without(Interactable)) {
		prompt.prompt.Destroy();
		world.remove(id, Prompt);
	}
}
scheduler().addSystem(ManagePromptsForInteractablesSystem);
