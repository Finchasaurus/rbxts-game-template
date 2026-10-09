import { component, meta, tag } from "@rbxts/jecs";
import type { collect } from "@rbxts/jecs-utils";
import type { InstanceTree } from "@rbxts/validate-tree";
import type { ButtonModel } from "server/scene-bake/types/button";
import { RenderableIsa } from "./general";
import { replicatedComponent, replicatedTag } from "./util";

export type CollectLike<T extends unknown[]> = ReturnType<typeof collect<T>>;

export const Triggers = replicatedTag();

export const InteractableTree = {
	$className: "Model",
	Prompt: "Attachment",
} satisfies InstanceTree;

export const Interactable = replicatedTag();
export const Prompt = component<{ prompt: ProximityPrompt; event: CollectLike<[playerWhoTriggered: Player]> }>();

export const Activated = tag();

export const ButtonInstance = replicatedComponent<ButtonModel>();
meta(ButtonInstance, RenderableIsa);
