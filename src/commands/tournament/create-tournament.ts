import {
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from "discord.js";
import { tournaments } from "../../database/schema";
import { Command } from "../../interfaces/command";
import { db } from "../../main";

export const createTournament: Command = {
  data: new SlashCommandBuilder()
    .setName("create-tournament")
    .setDescription(
      "Create a tournament with all the roles and channels necessary for it."
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the tournament. (Max. 64 characters)")
        .setRequired(true)
        .setMaxLength(64)
    )
    .addStringOption((option) =>
      option
        .setName("acronym")
        .setDescription("The acronym for the tournament. (Max. 8 characters)")
        .setRequired(true)
        .setMaxLength(8)
    )
    .addStringOption((option) =>
      option
        .setName("win-condition")
        .setDescription("The win condition rule for the tournament.")
        .setRequired(true)
        .addChoices(
          { name: "Score", value: "score" },
          { name: "Accuracy", value: "acc" },
          { name: "Miss count", value: "misses" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("scoring")
        .setDescription("The scoring type the tournament is based on.")
        .setRequired(true)
        .addChoices(
          { name: "ScoreV1", value: "v1" },
          { name: "ScoreV2", value: "v2" },
          { name: "Lazer", value: "lazer" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of tournament it will be.")
        .setRequired(true)
        .addChoices(
          { name: "Team based", value: "team_based" },
          { name: "1v1", value: "one_vs_one" },
          { name: "Battle Royale", value: "battle_royale" }
        )
    )
    .addRoleOption((option) =>
      option
        .setName("staff-role")
        .setDescription(
          "The staff role for the tournament. One will be created based on the acronym if not specified."
        )
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("referee-role")
        .setDescription(
          "The referee role for the tournament. One will be created based on the acronym if not specified."
        )
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("player-role")
        .setDescription(
          "The player role for the tournament. One will be created based on the acronym if not specified."
        )
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName("staff-channel")
        .setDescription(
          "The staff channel for the tournament. One will be created if not specified."
        )
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName("referee-channel")
        .setDescription(
          "The refeere channel for the tournament. One will be created if not specified."
        )
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName("schedules-channel")
        .setDescription(
          "The schedules channel for the tournament. One will be created if not specified."
        )
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    await interaction.deferReply();
    let embedDescription = "";

    const name = interaction.options.get("name").value as string;
    const acronym = interaction.options.get("acronym").value as string;
    const winCondition = interaction.options.get("win-condition").value as
      | "score"
      | "acc"
      | "misses";
    embedDescription += `• **Win condition:** \`${winCondition}\`\n`;

    const scoring = interaction.options.get("scoring").value as
      | "v1"
      | "v2"
      | "lazer";
    embedDescription += `• **Scoring:** \`${scoring}\`\n`;

    const tournamentType = interaction.options.get("type").value as
      | "team_based"
      | "one_vs_one"
      | "battle_royale";
    embedDescription += `• **Type:** \`${tournamentType}\`\n`;

    const staffRole =
      (interaction.options.get("staff-role")?.role as Role) ??
      (await interaction.guild.roles.create({ name: `${acronym}: Staff` }));
    embedDescription += `• **Staff role:** ${staffRole}\n`;

    const refereeRole =
      (interaction.options.get("referee-role")?.role as Role) ??
      (await interaction.guild.roles.create({ name: `${acronym}: Referee` }));
    embedDescription += `• **Referee role:** ${refereeRole}\n`;

    const playerRole =
      (interaction.options.get("player-role")?.role as Role) ??
      (await interaction.guild.roles.create({ name: `${acronym}: Player` }));
    embedDescription += `• **Player role:** ${playerRole}\n`;

    const staffChannel =
      interaction.options.get("staff-channel")?.channel ??
      (await interaction.guild.channels.create({
        name: "staff",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: staffRole,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
        ],
      }));
    embedDescription += `• **Staff channel:** ${staffChannel}\n`;

    const refereeChannel =
      interaction.options.get("referee-channel")?.channel ??
      (await interaction.guild.channels.create({
        name: "referee",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: refereeRole,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
        ],
      }));
    embedDescription += `• **Referee channel:** ${refereeChannel}\n`;

    const schedulesChannel =
      interaction.options.get("schedules-channel")?.channel ??
      (await interaction.guild.channels.create({
        name: "schedules",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: refereeRole,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
          {
            id: playerRole,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
        ],
      }));
    embedDescription += `• **Schedules channel:** ${schedulesChannel}\n`;

    await db.insert(tournaments).values({
      name,
      acronym,
      winCondition,
      scoring,
      type: tournamentType,
      staffRoleId: +staffRole.id,
      refereeRoleId: +refereeRole.id,
      playerRoleId: +playerRole.id,
      creatorId: +interaction.user.id,
      serverId: +interaction.guild.id,
      staffChannelId: +staffChannel.id,
      refereeChannelId: +refereeChannel.id,
      schedulesChannelId: +schedulesChannel.id,
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Successfully created the tournament.")
      .setDescription(embedDescription);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
