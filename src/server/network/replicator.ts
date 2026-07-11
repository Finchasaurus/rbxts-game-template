import { replicator } from "shared/network/replicator";
import { Functions } from "./network";

export const Replicator = replicator().server;
Replicator.init();

Functions.replecs.receiveFull.setCallback((player) => {
	Replicator.mark_player_ready(player);
	const [b, v] = Replicator.get_full(player);

	return [b, v];
});
