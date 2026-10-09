import { replicator } from "shared/network/replicator";
import { Functions } from "./network";

export const ServerReplicator = replicator().server;
ServerReplicator.init();

Functions.replecs.receiveFull.setCallback((player) => {
	ServerReplicator.mark_player_ready(player);
	const [b, v] = ServerReplicator.get_full(player);

	return [b, v];
});
