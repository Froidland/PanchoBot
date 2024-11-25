import {
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
} from "discord.js";

export interface ContextMenuCommand {
	data: ContextMenuCommandBuilder;
	execute: (
		interaction:
			| MessageContextMenuCommandInteraction
			| UserContextMenuCommandInteraction,
	) => Promise<void>;
}
