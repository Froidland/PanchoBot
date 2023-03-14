import {
  ChannelType,
  InteractionResponse,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { v2 } from "osu-api-extended";
import { prisma } from "../../database";
import { Command } from "../../interfaces/command";

export const archiveCategory: Command = {
  data: new SlashCommandBuilder()
    .setName("archive-category")
    .setDescription(
      "Moves text channels from source category to target category and privates them by default."
    )
    .addChannelOption((option) =>
      option
        .setName("source")
        .setDescription("Category to archive under the target category.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("target")
        .setDescription("Category to archive the source under.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("String to prefix each channel name with.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    //TODO: Add option for a view-only role.
    await interaction.deferReply();
    const sourceOption = interaction.options.get("source", true);
    const targetOption = interaction.options.get("target", true);
    const prefixOption = interaction.options.get("prefix", false);
    let sourceTextChannelsCount = 0;

    const sourceCategoryId = sourceOption.channel.id;
    const targetCategoryId = targetOption.channel.id;

    //? Handle case where the source category is the same as the target category.
    if (sourceCategoryId === targetCategoryId) {
      await interaction.editReply({
        content:
          "Error: The source category is the same as the target category.",
      });

      return;
    }

    const sourceCategory = await interaction.guild.channels.fetch(
      sourceCategoryId
    );

    const sourceCategoryChannels = interaction.guild.channels.cache.map(
      (channel) => {
        if (
          channel.parent === sourceCategory &&
          channel.type == ChannelType.GuildText
        ) {
          //! Read below for the reason to this. tldr: it's fucking stupid.
          sourceTextChannelsCount++;
          return channel;
        }
      }
    );

    //? Handle case where the source category has no channels in it.
    if (sourceTextChannelsCount < 1) {
      await interaction.editReply({
        content: "Error: The source category has no text channels.",
      });

      return;
    }

    for (const channel of sourceCategoryChannels) {
      //TODO: Figure this shit out.
      //! idk man this shit is stupid. for some reason the map above is returning some "undefined" channels.
      //! I have no idea what the cause of it is but this solution works to mitigate that :clueless:
      if (channel !== undefined && channel !== null) {
        if (prefixOption) {
          await channel.edit({
            parent: targetCategoryId,
            name: `${prefixOption.value}-${channel.name}`,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ],
          });
          continue;
        }

        await channel.edit({
          parent: targetCategoryId,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });
      }
    }

    await interaction.editReply({
      content: "Successfully archived text channels in source category.",
    });
  },
};
