import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/command";
import { db, logger } from "../../main";

export const coinflip: Command = {
	data: new SlashCommandBuilder()
		.setName("coinflip")
		.setDescription("Flip a coin and bet on the outcome.")
		.addStringOption((option) =>
			option
				.setName("side")
				.setDescription("The side of the coin you think it will land on.")
				.addChoices(
					{
						name: "Heads",
						value: "heads",
					},
					{
						name: "Tails",
						value: "tails",
					}
				)
				.setRequired(true)
		),

	execute: async (interaction: CommandInteraction) => {
		await interaction.deferReply();
		const user = await db
			.selectFrom("users")
			.selectAll()
			.where("discord_id", "=", +interaction.user.id)
			.executeTakeFirst();

		if (!user) {
			await interaction.editReply(
				"You don't have an account. Please use the `/link` command to link your osu! account."
			);
			return;
		}

		const side = interaction.options.get("side").value as string;

		const coin = Math.random() < 0.5 ? "heads" : "tails";

		try {
			const newMoneyValue =
				side === coin
					? Math.ceil(user.money * 1.1 + 100)
					: Math.ceil(user.money * 0.75);

			await db
				.updateTable("users")
				.set({
					money: newMoneyValue,
				})
				.where("discord_id", "=", +interaction.user.id)
				.execute();

				await interaction.editReply(
					`The coin landed on ${coin}. You ${side === coin ? "win!" : "lose"}. You now have ${newMoneyValue} coins.`
				);

		} catch (error) {
			logger.error(error);
			await interaction.editReply("An error occurred.");
			return;
		}
	},
};
