import { Command } from "../../interfaces/command";
import { archiveCategory } from "./archiveCategory";
import { addEmoji } from "./addEmoji";

export const slashCommandList: Command[] = [archiveCategory, addEmoji];
