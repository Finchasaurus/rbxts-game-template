declare global {
	interface Instance {
		GetAttribute<T extends AttributeValue = AttributeValue>(attribute: string): T | undefined;

		SetAttribute<T extends AttributeValue>(attribute: string, value: T | undefined): void;
	}

	interface ReplicatedStorage {
		client: Folder & {
			systems: Folder;
		};
		shared: Folder & {
			systems: Folder;
		};
	}

	interface ServerScriptService {
		server: Folder & {
			systems: Folder;
		};
	}

	interface Player {
		PlayerGui: PlayerGui;
	}
}

export {};
