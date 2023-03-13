import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { v2 } from "osu-api-extended";
import { prisma } from "../../database";
import { Command } from "../../interfaces/command";
import { logger } from "../../main";
import { getFlagUrl } from "../../utils";

export const profile: Command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription(
      "Sends the profile of your linked username. Accepts a username as an optional argument."
    )
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Username of the user to display the profile of.")
    ),
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const usernameOption = interaction.options.get("username", false);
    let searchParameter: string | number | null;

    // If the option is null, we search for the user_id associated with the users discord_id, otherwise we just use the username option.
    if (usernameOption === null) {
      const user = await prisma.user.findUnique({
        where: {
          discordId: +interaction.user.id,
        },
      });

      if (user === null) {
        await interaction.editReply({
          content:
            "Please link an osu! username in order to use this command with no arguments.",
        });

        return;
      }

      searchParameter = user.userId;
    } else {
      searchParameter = interaction.options.get("username").value as string;
    }

    const userDetails = await v2.user.details(
      searchParameter,
      "osu",
      usernameOption === null ? "id" : "username"
    );

    if (userDetails["error"] === null) {
      await interaction.editReply({ content: "User not found." });
      return;
    }

    const countryFlagUrl = getFlagUrl(userDetails.country_code);

    const acc = userDetails.statistics.hit_accuracy.toFixed(2);
    const currentLevel = userDetails.statistics.level.current;
    const currentLevelProgress = userDetails.statistics.level.progress;

    const playCount = userDetails.statistics.play_count;
    const playTimeHours = (userDetails.statistics.play_time / 3600).toFixed(0);

    const medalCount = userDetails.user_achievements.length;

    const joinDateString = new Date(userDetails.join_date).toLocaleString(
      new Intl.Locale("es-ES")
    );

    let description = `Accuracy: \`${acc}%\` • Level: \`${currentLevel}.${currentLevelProgress}\`\n`;
    description += `Playcount: \`${playCount}\` (\`${playTimeHours} hrs\`)\n`;
    description += `Medals: \`${medalCount}\``;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: `${userDetails.username}: ${userDetails.statistics.pp.toFixed(
          2
        )}pp (#${userDetails.statistics.global_rank} ${
          userDetails.country_code
        }${userDetails.statistics.country_rank})`,
        url: `https://osu.ppy.sh/users/${userDetails.id}`,
        iconURL: countryFlagUrl,
      })
      .setDescription(description)
      .setFooter({ text: `Joined osu! on ${joinDateString}` })
      .setThumbnail(userDetails.avatar_url);

    await interaction.editReply({ embeds: [embed] });
  },
};
