import {
  ChannelType,
  EmbedBuilder,
  OverwriteResolvable,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces/command";

export const archiveCategory: Command = {
  data: new SlashCommandBuilder()
    .setName("archive-category")
    .setDescription(
      "Move text channels from source category to target category and private them by default."
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
        .setDescription("Category to archive the source text channels under.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("delete")
        .setDescription(
          "Whether the source category gets deleted or not after the process is done."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("String to prefix each channel name with.")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("view-role")
        .setDescription(
          "Role with view-only permissions on the archived channels."
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    await interaction.deferReply();
    const sourceOption = interaction.options.get("source", true);
    const targetOption = interaction.options.get("target", true);
    const deleteSourceOption = interaction.options.get("delete", true);
    const prefixOption = interaction.options.get("prefix", false);
    const viewRoleOption = interaction.options.get("view-role", false);

    let targetChannelPermissions: OverwriteResolvable[] = [
      {
        id: interaction.guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel],
      },
    ];

    if (viewRoleOption !== null) {
      targetChannelPermissions.push({
        id: viewRoleOption.role.id,
        allow: [PermissionFlagsBits.ViewChannel],
        deny: [PermissionFlagsBits.SendMessages],
      });
    }

    let sourceTextChannelsCount = 0;

    const sourceCategoryId = sourceOption.channel.id;
    const targetCategoryId = targetOption.channel.id;

    //? Handle case where the source category is the same as the target category.
    if (sourceCategoryId === targetCategoryId) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error")
            .setDescription(
              `\`The source category is the same as the target category.\``
            ),
        ],
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
          channel.type == ChannelType.GuildText &&
          channel !== undefined &&
          channel !== null
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
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error")
            .setDescription(`\`The source category has no text channels.\``),
        ],
      });

      return;
    }

    for (const channel of sourceCategoryChannels) {
      //! idk man this shit is stupid. for some reason the map above is returning some "undefined" channels.
      //! I have no idea what the cause of it is but this solution works to mitigate that :clueless:
      if (channel !== undefined && channel !== null) {
        if (prefixOption) {
          await channel.edit({
            parent: targetCategoryId,
            name: `${prefixOption.value}-${channel.name}`,
            permissionOverwrites: targetChannelPermissions,
          });
          continue;
        }

        await channel.edit({
          parent: targetCategoryId,
          permissionOverwrites: targetChannelPermissions,
        });
      }
    }

    if (deleteSourceOption.value === true) {
      await sourceCategory.delete();
    }

    await interaction.editReply({
      content: "Successfully archived text channels in source category.",
    });
  },
};
