import { SlashCommand } from "../../interfaces/slashCommand";
import { archiveCategory } from "./archiveCategory";
import { addEmoji } from "./addEmoji";
import { setPersonalServer } from "./setPersonalServer";
import { deleteCategory } from "./deleteCategory";

export const slashCommandList: SlashCommand[] = [
	archiveCategory,
	deleteCategory,
	addEmoji,
	setPersonalServer,
];
