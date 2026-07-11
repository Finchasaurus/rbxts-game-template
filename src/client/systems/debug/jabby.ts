import Konsole from "@kyrorblx/konsole";
import { obtain_client } from "@rbxts/jabby";
import client from "@rbxts/jabby/out/jabby/client";
import { ContextActionService } from "@rbxts/services";

ContextActionService.BindAction(
	"ToggleJabby",
	(_, state) => {
		const client = obtain_client();
		if (state === Enum.UserInputState.Begin) {
			client.spawn_app(client.apps.home);
		}
	},
	false,
	Enum.KeyCode.F3,
);

Konsole.define({
	name: "togglejabby",
	rank: 100,
	aliases: ["jabby"],
	description: "toggle jabby debugger",
	run: () => {
		obtain_client().spawn_app(client.apps.home);
	},
});
