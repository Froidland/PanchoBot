import {
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from "discord.js";
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
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName("referee-channel")
        .setDescription(
          "The refeere channel for the tournament. One will be created if not specified."
        )
        .addChannelTypes(ChannelType.GuildText)
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
    .addChannelOption((option) =>
      option
        .setName("parent-category")
        .setDescription(
          "The category under which the created channels will be placed."
        )
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    await interaction.deferReply();

    let isStaffChannelUsed = false;
    let isRefereeChannelUsed = false;
    let isSchedulesChannelUsed = false;

    // Check if the user has linked their account.
    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("discord_id", "=", +interaction.user.id)
      .execute();

    if (user.length < 1) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error")
            .setDescription(
              `**You must link your account before attempting to create a tournament.**`
            ),
        ],
      });

      return;
    }

    let staffChannel =
      interaction.options.get("staff-channel")?.channel ?? null;
    let refereeChannel =
      interaction.options.get("referee-channel")?.channel ?? null;
    let schedulesChannel =
      interaction.options.get("schedules-channel")?.channel ?? null;

    let createdChannelsCount = 0;

    // Check if the channels are already used by another tournament and if one of the options is the same as another one.

    if (staffChannel !== null) {
      if (
        staffChannel === refereeChannel ||
        staffChannel === schedulesChannel
      ) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Error")
              .setDescription(
                `**The staff channel cannot be the same as one of the other options.**`
              ),
          ],
        });

        return;
      }

      isStaffChannelUsed =
        (await db
          .selectFrom("tournaments")
          .select("staff_channel_id")
          .where("staff_channel_id", "=", +staffChannel.id)
          .executeTakeFirst()) === undefined
          ? false
          : true;

      if (isStaffChannelUsed) {
        createdChannelsCount++;
        staffChannel = undefined;
      }
    } else {
      createdChannelsCount++;
    }

    if (refereeChannel !== null) {
      if (
        refereeChannel === staffChannel ||
        refereeChannel === schedulesChannel
      ) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Error")
              .setDescription(
                `**The referee channel cannot be the same as one of the other options.**`
              ),
          ],
        });

        return;
      }

      isRefereeChannelUsed =
        (await db
          .selectFrom("tournaments")
          .select("referee_channel_id")
          .where("referee_channel_id", "=", +refereeChannel.id)
          .executeTakeFirst()) === undefined
          ? false
          : true;

      if (isRefereeChannelUsed) {
        createdChannelsCount++;
        refereeChannel = undefined;
      }
    } else {
      createdChannelsCount++;
    }

    if (schedulesChannel !== null) {
      if (
        schedulesChannel === staffChannel ||
        schedulesChannel === refereeChannel
      ) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Error")
              .setDescription(
                `**The schedules channel cannot be the same as one of the other options.**`
              ),
          ],
        });

        return;
      }

      isSchedulesChannelUsed =
        (await db
          .selectFrom("tournaments")
          .select("schedules_channel_id")
          .where("schedules_channel_id", "=", +schedulesChannel.id)
          .executeTakeFirst()) === undefined
          ? false
          : true;

      if (isSchedulesChannelUsed) {
        createdChannelsCount++;
        schedulesChannel = undefined;
      }
    } else {
      createdChannelsCount++;
    }

    const parentCategory =
      interaction.options.get("parent-category")?.channel ?? null;

    // Check if the parent category has enough space to hold all the channels that have to be created.
    if (parentCategory !== null) {
      let parentChannelsCount = 0;

      for (const [_, channel] of interaction.guild.channels.cache) {
        if (channel.parent === parentCategory) {
          parentChannelsCount++;
        }
      }

      if (parentChannelsCount + createdChannelsCount > 50) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Error")
              .setDescription(
                `**The parent category doesn't have enough space to hold all the text channels that have to be created.**`
              ),
          ],
        });

        return;
      }
    }

    let embedDescription = "";

    const name = interaction.options.get("name").value as string;
    const acronym = interaction.options.get("acronym").value as string;
    const winCondition = interaction.options.get("win-condition").value as
      | "score"
      | "acc"
      | "misses";
    embedDescription += `:green_circle: **Win condition:** \`${winCondition}\`\n`;

    const scoring = interaction.options.get("scoring").value as
      | "v1"
      | "v2"
      | "lazer";
    embedDescription += `:green_circle: **Scoring:** \`${scoring}\`\n`;

    const tournamentType = interaction.options.get("type").value as
      | "team_based"
      | "one_vs_one"
      | "battle_royale";
    embedDescription += `:green_circle: **Type:** \`${tournamentType}\`\n`;

    const staffRole =
      (interaction.options.get("staff-role")?.role as Role) ??
      (await interaction.guild.roles.create({ name: `${acronym}: Staff` }));
    embedDescription += `:green_circle: **Staff role:** ${staffRole}\n`;

    const refereeRole =
      (interaction.options.get("referee-role")?.role as Role) ??
      (await interaction.guild.roles.create({ name: `${acronym}: Referee` }));
    embedDescription += `:green_circle: **Referee role:** ${refereeRole}\n`;

    const playerRole =
      (interaction.options.get("player-role")?.role as Role) ??
      (await interaction.guild.roles.create({ name: `${acronym}: Player` }));
    embedDescription += `:green_circle: **Player role:** ${playerRole}\n`;

    // Create the channels missing from the options.
    // If the channel is set to null, it means that it has to be created.
    // If the channel is set to undefined, it means that it has already been used by another tournament and another one has to be created.
    // If the channel is set to a channel, it means that it has been set by the user.

    if (staffChannel === null) {
      staffChannel = await interaction.guild.channels.create({
        name: "staff",
        parent: parentCategory?.id ?? null,
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
      });

      embedDescription += `:green_circle: **Staff channel:** Created ${staffChannel}\n`;
    } else if (staffChannel === undefined) {
      staffChannel = await interaction.guild.channels.create({
        name: "staff",
        parent: parentCategory?.id ?? null,
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
      });
      embedDescription += `:red_circle: **Staff channel:** Already used by another tournament, created ${staffChannel}\n`;
    } else {
      embedDescription += `:yellow_circle: **Staff channel:** Used ${staffChannel}\n`;
    }

    if (refereeChannel === null) {
      refereeChannel = await interaction.guild.channels.create({
        name: "referee",
        parent: parentCategory?.id ?? null,
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
      });

      embedDescription += `:green_circle: **Referee channel:** Created ${refereeChannel}\n`;
    } else if (refereeChannel === undefined) {
      refereeChannel = await interaction.guild.channels.create({
        name: "referee",
        parent: parentCategory?.id ?? null,
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
      });

      embedDescription += `:red_circle: **Referee channel:** Already used by another tournament, created ${refereeChannel}\n`;
    } else {
      embedDescription += `:yellow_circle: **Referee channel:** Used ${refereeChannel}\n`;
    }

    if (schedulesChannel === null) {
      schedulesChannel = await interaction.guild.channels.create({
        name: "schedules",
        parent: parentCategory?.id ?? null,
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
      });

      embedDescription += `:green_circle: **Schedules channel:** Created ${schedulesChannel}\n`;
    } else if (schedulesChannel === undefined) {
      schedulesChannel = await interaction.guild.channels.create({
        name: "schedules",
        parent: parentCategory?.id ?? null,
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
      });

      embedDescription += `:red_circle: **Schedules channel:** Already used by another tournament, created ${schedulesChannel}\n`;
    } else {
      embedDescription += `:yellow_circle: **Schedules channel:** Used ${schedulesChannel}\n`;
    }

    const result = await db
      .insertInto("tournaments")
      .values({
        name,
        acronym,
        win_condition: winCondition,
        scoring,
        type: tournamentType,
        staff_role_id: +staffRole.id,
        referee_role_id: +refereeRole.id,
        player_role_id: +playerRole.id,
        creator_id: +interaction.user.id,
        server_id: +interaction.guild.id,
        staff_channel_id: +staffChannel.id,
        referee_channel_id: +refereeChannel.id,
        schedules_channel_id: +schedulesChannel.id,
      })
      .executeTakeFirst();

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Tournament successfully created.")
      .setDescription(embedDescription);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
