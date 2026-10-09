import { pair } from "@rbxts/jecs";
import type { EvaluateInstanceTree } from "@rbxts/validate-tree";
import { ServerReplicator } from "server/network/replicator";
import { ButtonInstance, Triggers } from "shared/components";
import { defineSceneType, getLinkedEntityFromInstance } from "../util";

export const ButtonTree = {
	$className: "Model",
	Prompt: "Attachment",
} as const;

export type ButtonModel = EvaluateInstanceTree<typeof ButtonTree>;

export const Button = defineSceneType({
	tree: ButtonTree,
	renderable: ButtonInstance,
	callback: (world, id, instance) => {
		const target = getLinkedEntityFromInstance(instance);

		if (target !== undefined) {
			const triggerRelation = pair(Triggers, target);

			world.add(id, triggerRelation);
			ServerReplicator.set_pair(id, triggerRelation);
		}
	},
});
