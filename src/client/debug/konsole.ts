import Konsole from "@kyrorblx/konsole";
import { ContextActionService } from "@rbxts/services";

ContextActionService.BindAction(
	"ToggleKonsole",
	(_, state) => {
		if (state === Enum.UserInputState.Begin) {
			Konsole.toggle();
		}
	},
	false,
	Enum.KeyCode.F2,
);

warn("Privilaged access is enabled for all users. Remember to remove this in production builds!");
Konsole.bindRanks(() => {
	return 1000;
});
