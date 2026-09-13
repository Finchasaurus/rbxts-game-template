import { Flamework } from "@flamework/core";
import { createPlayerStore, MockDataStoreService, MockMemoryStoreService } from "@rbxts/lyra";

export interface ProfileData {
	// Increment everytime we update and need to migrate data once game is published
	saveVersion: 1;
	totalPlaytime: number;
	lastSessionPlaytime: number;
	firstJoin: number;
	lastLogin: number;
}

export interface PlayerSaveData {
	profile: ProfileData;
}

const playerDataTemplate: PlayerSaveData = {
	profile: {
		saveVersion: 1,
		totalPlaytime: 0,
		lastSessionPlaytime: 0,
		firstJoin: 0,
		lastLogin: 0,
	},
};

const playerDataSchema = Flamework.createGuard<PlayerSaveData>();

type PendingPlayerDataUpdate = Set<keyof PlayerSaveData>;

export const pendingDataUpdates = new Map<string, { data: PlayerSaveData; update: PendingPlayerDataUpdate }>();

export const playerDataStore = createPlayerStore({
	name: "PlayerData",
	template: playerDataTemplate,
	schema: playerDataSchema,

	changedCallbacks: [
		(key, newData, oldData) => {
			const update = new Set<keyof PlayerSaveData>();

			if (newData.profile !== oldData?.profile) update.add("profile");

			pendingDataUpdates.set(key, {
				data: newData,
				update,
			});
		},
	],

	dataStoreService: new MockDataStoreService(),
	memoryStoreService: new MockMemoryStoreService(),
});
