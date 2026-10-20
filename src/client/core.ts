import { StarterGui } from "@rbxts/services";

/**
 * Roblox core configuration (StarterGui SetCore / SetCoreGuiEnabled)
 *
 * Since they can only be set once registered they are retried until they succeed.
 */

const ResetEvent = new Instance("BindableEvent");
ResetEvent.Event.Connect(() => {
	// todo: make popup confirming reset
});

function SetWhenReady(callback: () => void) {
	task.spawn(() => {
		while (!pcall(callback)[0]) {
			task.wait();
		}
	});
}

export function SetCoreWhenReady<T extends keyof SettableCores>(core: T, value: SettableCores[T]) {
	SetWhenReady(() => StarterGui.SetCore(core, value));
}

export function SetCoreGuiWhenReady(coreGuiType: CastsToEnum<Enum.CoreGuiType>, enabled: boolean) {
	SetWhenReady(() => StarterGui.SetCoreGuiEnabled(coreGuiType, enabled));
}

SetCoreWhenReady("ResetButtonCallback", ResetEvent);
SetCoreGuiWhenReady("Backpack", false);
