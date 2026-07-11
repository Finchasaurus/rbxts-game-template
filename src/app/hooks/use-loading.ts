import { useEffect, useState } from "@rbxts/react";

export function useLoading() {
	const [loading, setLoading] = useState(!game.IsLoaded());

	useEffect(() => {
		if (game.IsLoaded()) {
			setLoading(false);
			return;
		}

		const connection = game.Loaded.Connect(() => {
			setLoading(false);
			connection.Disconnect();
		});

		return () => {
			connection.Disconnect();
		};
	}, []);

	return loading;
}
