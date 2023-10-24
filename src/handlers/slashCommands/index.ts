import { SlashCommand } from "../../interfaces/slashCommand";
import { archiveCategory } from "./archiveCategory";
import { addEmoji } from "./addEmoji";

export const slashCommandList: SlashCommand[] = [archiveCategory, addEmoji];
