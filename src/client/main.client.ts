import "@rbxts/replecs";
import { ReplicatedStorage } from "@rbxts/services";
import { initApp } from "app/root";
import "shared/components";
import { initScheduler } from "shared/core/scheduler";
import { start } from "shared/core/start";
import { createWorld } from "shared/core/world";
import { initReplicator } from "shared/network/replicator";

const world = createWorld();

initApp(world);
initReplicator(world);
initScheduler(world);
start(world, ReplicatedStorage.client.systems, ReplicatedStorage.shared.systems);
