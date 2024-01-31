import { ContextMenuCommand } from "../../interfaces/index.js";
import { addEmoji } from "./addEmoji.js";
import { addEmojiPersonal } from "./addEmojiPersonal.js";

export const contextMenuCommandList: ContextMenuCommand[] = [
	addEmoji,
	addEmojiPersonal,
];
