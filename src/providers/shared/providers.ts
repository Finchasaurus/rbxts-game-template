import type { World } from "@rbxts/jecs";

export interface Provider {
	init: (world: World) => void;
}

const providers = new Array<Provider>();

export function registerProvider(provider: Provider) {
	providers.push(provider);
}

export function initProviders(world: World) {
	for (const provider of providers) {
		provider.init(world);
	}
}
