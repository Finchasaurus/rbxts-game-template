import { playerDataStore } from "../data";

export async function UpdatePlaytime(player: Player, session: number) {
	await playerDataStore.update(player, (data) => {
		const elapsed = session - data.profile.lastSessionPlaytime;

		if (elapsed <= 0) return false;

		data.profile.totalPlaytime += elapsed;
		data.profile.lastSessionPlaytime = session;

		return true;
	});
}
