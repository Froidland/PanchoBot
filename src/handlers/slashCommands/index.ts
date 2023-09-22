import { Command } from "../../interfaces/command.js";
import { archiveCategory } from "./archiveCategory.js";
import { addEmoji } from "./addEmoji.js";

export * from "./archiveCategory.js";
export * from "./addEmoji.js";

export const _commandList: Command[] = [archiveCategory, addEmoji]
