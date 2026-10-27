import { pair } from "@rbxts/jecs";
import type { EvaluateInstanceTree } from "@rbxts/validate-tree";
import { ButtonInstance, Triggers } from "components";
import { ServerReplicator } from "network/server/replicator";
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
