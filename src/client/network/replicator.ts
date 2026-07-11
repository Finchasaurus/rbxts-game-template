import { replicator } from "shared/network/replicator";
import { Functions } from "./network";

export const Replicator = replicator().client;
Replicator.init();

Functions.replecs.receiveFull.invoke().then(([b, variants]) => {
	Replicator.apply_full(b as buffer, variants as defined[][]);
});
