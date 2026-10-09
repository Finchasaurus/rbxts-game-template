import { pair, Wildcard, type World } from "@rbxts/jecs";
import { Clock, Timer, TimerExpired } from "./components";
import { scheduler } from "./core/scheduler";

function TimerSystem(world: World) {
	// Frame passed since expiration so remove
	for (const [e] of world.query(TimerExpired)) {
		world.remove(e, TimerExpired);
	}

	const dt = scheduler().getDeltaTime();
	for (const [e] of world.query(pair(Timer, Wildcard))) {
		for (const [t] of world.targets(e, Timer)) {
			const timer = world.get(e, pair(Timer, t)) as number;

			const newTimer = timer - dt;

			world.set(e, pair(Timer, t), newTimer);

			if (newTimer < 0) {
				world.remove(e, pair(Timer, t));
				world.add(e, TimerExpired);
			}
		}
	}
}

function ClockSystem(world: World) {
	const dt = scheduler().getDeltaTime();
	for (const [e] of world.query(pair(Clock, Wildcard))) {
		for (const [t] of world.targets(e, Clock)) {
			const clock = world.get(e, pair(Clock, t)) as number;

			const newClock = clock + dt;

			world.set(e, pair(Clock, t), newClock);
		}
	}
}

scheduler().addSystems([TimerSystem, ClockSystem]);
