import { PlayerProfile } from "components";
import type { DataInitializer } from "../sync";

export const profile: DataInitializer = ({ world, playerId, data }) => {
	world.set(playerId, PlayerProfile, data.profile);
};
