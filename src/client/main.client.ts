import { Flamework } from "@flamework/core";
import "@rbxts/replecs";
import { initApp } from "app/root";
import "shared/components";
import { start } from "shared/core/start";
import { createWorld } from "shared/core/world";

const world = createWorld();

Flamework.addPaths("src/client");
Flamework.addPaths("src/shared");

initApp(world);
start(world);
