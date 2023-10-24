import { SlashCommand } from "../../interfaces/slashCommand";
import { archiveCategory } from "./archiveCategory";
import { addEmoji } from "./addEmoji";
import { setPersonalServer } from "./setPersonalServer";

export const slashCommandList: SlashCommand[] = [
	archiveCategory,
	addEmoji,
	setPersonalServer,
];
