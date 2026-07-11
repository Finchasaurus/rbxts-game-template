import { Networking } from "@flamework/networking";
import type { Entity } from "@rbxts/jecs";

interface ClientToServerEvents {
	gameplay: object;
}
interface ClientToServerFunctions {
	replecs: {
		receiveFull(): [buff: unknown, variants: unknown];
	};
}

interface ServerToClientEvents {
	replecs: {
		deleteEntity(e: Entity): void;
		sendUpdates(buff: buffer, variants?: defined[][]): void;
		sendEntity(buff: buffer, variants?: defined[][]): void;
		sendUnreliables: Networking.Unreliable<(buff: buffer, variants?: defined[][]) => void>;
	};
}
type ServerToClientFunctions = object;

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
