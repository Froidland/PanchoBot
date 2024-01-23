import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const confirmationButton = new ButtonBuilder()
	.setCustomId("confirmation-confirm-button")
	.setLabel("Confirm")
	.setStyle(ButtonStyle.Danger);

const cancelButton = new ButtonBuilder()
	.setCustomId("confirmation-cancel-button")
	.setLabel("Cancel")
	.setStyle(ButtonStyle.Primary);

export const ConfirmationComponent =
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		confirmationButton,
		cancelButton,
	);
