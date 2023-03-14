import { Message } from "discord.js";

export const onMessageCreate = async (message: Message) => {
  if (message.channel.id === "872487113071943711" && !message.author.bot) {
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
  }
};
