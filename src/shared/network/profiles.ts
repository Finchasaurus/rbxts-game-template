import { ChildOf, type Entity, type World } from "@rbxts/jecs";
import { shared } from "@rbxts/replecs";
import { Player } from "shared/components";

export const NetworkProfiles = {
	player: {
		reliable: [Player],
	},
} satisfies Record<string, NetworkProfile>;

export type NetworkProfileKey = keyof typeof NetworkProfiles;

interface NetworkProfile {
	reliable?: Entity[];
	unreliable?: Entity[];
	pairs?: Entity[];
}

const profiles = new Map<NetworkProfileKey, NetworkProfile>();

function registerProfile(world: World, name: NetworkProfileKey, profile: NetworkProfile) {
	profiles.set(name, profile);

	const mark = (arr?: Entity[]) => {
		if (!arr) return;
		for (const c of arr) {
			// replecs automatically shares these (stupid imo)
			if (c === ChildOf) continue;
			world.add(c, shared);
		}
	};

	mark(profile.reliable);
	mark(profile.unreliable);
	mark(profile.pairs);
}

export function getProfile(name: NetworkProfileKey) {
	return profiles.get(name);
}

export function registerNetworkProfiles(world: World) {
	for (const [key, profile] of pairs(NetworkProfiles)) {
		registerProfile(world, key, profile);
	}
}
