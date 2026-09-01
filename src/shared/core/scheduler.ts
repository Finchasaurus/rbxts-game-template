import type { World } from "@rbxts/jecs";
import { Scheduler as PlankScheduler } from "@rbxts/planck";
import { Plugin as RunServicePlugin } from "@rbxts/planck-runservice";

let s: PlankScheduler<[World]>;

export function initScheduler(world: World) {
	s = new PlankScheduler(world);

	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	type JabbyPluginCtor = typeof import("@rbxts/planck-jabby");

	import("@rbxts/planck-jabby").then((mod) => {
		const JabbyPlugin = mod as unknown as JabbyPluginCtor;
		s.addPlugin(new JabbyPlugin());
	});

	s.addPlugin(new RunServicePlugin());
}

export function scheduler() {
	return s;
}
