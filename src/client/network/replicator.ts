import { extendClient } from "shared/network/replecs-roblox";
import { replicator } from "shared/network/replicator";
import { Functions } from "./network";

export const ClientReplicator = extendClient(replicator().client);
ClientReplicator.init();

Functions.replecs.receiveFull.invoke().then(([b, variants]) => {
	ClientReplicator.apply_full(b as buffer, variants as defined[][]);
});
