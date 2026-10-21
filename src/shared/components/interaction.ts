import { component, tag } from "@rbxts/jecs";
import type { collect } from "@rbxts/jecs-utils";
import type { InstanceTree } from "@rbxts/validate-tree";
import type { ButtonModel } from "server/scene-bake/types/button";
import { renderable, replicatedComponent, replicatedTag } from "./util";

/** Components for interacting with scene entities (buttons, items, dorms). */

export type CollectLike<T extends unknown[]> = ReturnType<typeof collect<T>>;

/** `pair(Triggers, target)`: this entity triggers the target entity (e.g. a button and the door it opens). */
export const Triggers = replicatedTag();

/** What an instance must look like to be interactable: it needs a Prompt attachment to place the ProximityPrompt on. */
export const InteractableTree = {
	$className: "Model",
	Prompt: "Attachment",
} satisfies InstanceTree;

/** The entity can currently be interacted with. Clients create a prompt for it (replicated). */
export const Interactable = replicatedTag();
/** @client the ProximityPrompt of an interactable entity and the events of it being triggered. */
export const Prompt = component<{ prompt: ProximityPrompt; event: CollectLike<[playerWhoTriggered: Player]> }>();

/** Used as `pair(Activated, player)`: that player interacted with the entity and the server hasn't handled it yet. */
export const Activated = tag();

export const ButtonInstance = replicatedComponent<ButtonModel>(renderable());
