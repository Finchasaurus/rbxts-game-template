import { Button } from "./button";

export const SceneTypes = {
	Button,
} as const;

export type SceneType = keyof typeof SceneTypes;
