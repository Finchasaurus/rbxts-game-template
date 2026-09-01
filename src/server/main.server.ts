import { Flamework } from "@flamework/core";
import Konsole from "@kyrorblx/konsole";
import "@rbxts/replecs";
import "shared/components";
import { start } from "shared/core/start";
import { createWorld } from "shared/core/world";

const world = createWorld();

Konsole.host();

Flamework.addPaths("src/server");
Flamework.addPaths("src/shared");

start(world);
