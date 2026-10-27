import { extendClient } from "network/shared/replecs-roblox";
import { replicator } from "network/shared/replicator";
import { ClientFunctions } from "./network";

export const ClientReplicator = extendClient(replicator().client);
ClientReplicator.init();

ClientFunctions.replecs.receiveFull.invoke().then(([b, variants]) => {
	ClientReplicator.apply_full(b as buffer, variants as defined[][]);
});
