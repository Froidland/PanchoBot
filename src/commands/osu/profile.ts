import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { v2 } from "osu-api-extended";
import { Command } from "../../interfaces/command";
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
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const username = interaction.options.get("username").value as string;

    if (!username) {
      await interaction.editReply({ content: "No username specified." });
      return;
    }

    const user = await v2.user.details(username, "osu");
    const countryFlagUrl = getFlagUrl(user.country_code);

    const acc = user.statistics.hit_accuracy.toFixed(2);
    const currentLevel = user.statistics.level.current;
    const currentLevelProgress = user.statistics.level.progress;

    const playCount = user.statistics.play_count;
    const playTimeHours = (user.statistics.play_time / 3600).toFixed(0);

    const medalCount = user.user_achievements.length;

    const joinDateString = new Date(user.join_date).toLocaleString(
      new Intl.Locale("es-ES")
    );

    let description = `Accuracy: \`${acc}%\` • Level: \`${currentLevel}.${currentLevelProgress}\`\n`;
    description += `Playcount: \`${playCount}\` (\`${playTimeHours} hrs\`)\n`;
    description += `Medals: \`${medalCount}\``;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: `${user.username}: ${user.statistics.pp.toFixed(2)}pp (#${
          user.statistics.global_rank
        } CL${user.statistics.country_rank})`,
        url: `https://osu.ppy.sh/users/${user.id}`,
        iconURL: countryFlagUrl,
      })
      .setDescription(description)
      .setFooter({ text: `Joined osu! on ${joinDateString}` })
      .setThumbnail(user.avatar_url);

    await interaction.editReply({ embeds: [embed] });
  },
};
