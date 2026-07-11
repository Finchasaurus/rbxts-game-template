import Konsole from "@kyrorblx/konsole";
import "@rbxts/replecs";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import "shared/components";
import { initScheduler } from "shared/core/scheduler";
import { start } from "shared/core/start";
import { createWorld } from "shared/core/world";
import { initReplicator } from "shared/network/replicator";

const world = createWorld();

Konsole.host();

initReplicator(world);
initScheduler(world);
start(world, ServerScriptService.server.systems, ReplicatedStorage.shared.systems);
