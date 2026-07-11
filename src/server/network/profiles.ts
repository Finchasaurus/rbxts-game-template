import { type Entity } from "@rbxts/jecs";
import { type MemberFilter } from "@rbxts/replecs";
import { Replicator } from "server/network/replicator";
import type { NetworkProfileKey } from "shared/network/profiles";
import { getProfile } from "shared/network/profiles";

interface ProfileOptions {
	filter?: MemberFilter;
	componentFilters?: Partial<Record<Entity, MemberFilter>>;
}

export function applyProfile(entity: Entity, name: NetworkProfileKey, options: ProfileOptions = {}) {
	const profile = getProfile(name);
	if (!profile) {
		error(`Network profile '${name}' not found`);
	}

	Replicator.set_networked(entity, options.filter);

	if (profile.reliable) {
		for (const component of profile.reliable) {
			Replicator.set_reliable(entity, component, options.componentFilters?.[component]);
		}
	}

	if (profile.unreliable) {
		for (const component of profile.unreliable) {
			Replicator.set_unreliable(entity, component, options.componentFilters?.[component]);
		}
	}

	if (profile.pairs) {
		for (const relation of profile.pairs) {
			Replicator.set_relation(entity, relation, options.componentFilters?.[relation]);
		}
	}
}
