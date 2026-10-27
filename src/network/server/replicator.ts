import { extendServer } from "network/shared/replecs-roblox";
import { replicator } from "network/shared/replicator";
import { ServerFunctions } from "./network";

export const ServerReplicator = extendServer(replicator().server);
ServerReplicator.init();

ServerFunctions.replecs.receiveFull.setCallback((player) => {
	ServerReplicator.mark_player_ready(player);
	const [b, v] = ServerReplicator.get_full(player);

	return [b, v];
});
