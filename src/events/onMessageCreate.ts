import { Message } from "discord.js";

export const onMessageCreate = async (message: Message) => {
	if (!message.author.bot) {
		switch (message.channel.id) {
			case "872487113071943711":
				switch (message.content) {
					case "ol":
						await message.reply({
							content: "ol",
							allowedMentions: { repliedUser: false },
						});
						break;
					case "adiol":
						await message.reply({
							content: "<:olluo:967332372301369366>",
							allowedMentions: { repliedUser: false },
						});
						break;
					default:
						await message.delete();
						break;
				}
				break;
			case "968359767493967883":
				await message.delete();
				break;
		}
	}
};
