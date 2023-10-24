import { ContextMenuCommand } from "../../interfaces";
import { addEmoji } from "./addEmoji";
import { addEmojiPersonal } from "./addEmojiPersonal";

export const contextMenuCommandList: ContextMenuCommand[] = [
	addEmoji,
	addEmojiPersonal,
];
