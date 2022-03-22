using System;
using System.ComponentModel;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using PanchoBot.Api.v2;

namespace PanchoBot.Commands;

public class TournamentModule : BaseCommandModule {
    private static readonly OsuClient OsuClient = Program.Bot.OsuClient;
    
    [Command("createtournament")]
    [Aliases("createt", "ct")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task CreateTournament(CommandContext ctx, [RemainingText] string tournamentName) {
        DiscordMessage statusMessage;

        // Staff category creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating staff category...");
        var staffCategory = await ctx.Guild.CreateChannelCategoryAsync($"{tournamentName}: Staff");
        await staffCategory.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Staff category created!"));

        // Staff role creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating staff role...");
        var staffRole = await ctx.Guild.CreateRoleAsync($"{tournamentName}: Staff");
        await staffCategory.AddOverwriteAsync(staffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Staff role created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating mappooler role...");
        var mappoolerStaffRole = await ctx.Guild.CreateRoleAsync($"{tournamentName}: Mappooler");
        await staffCategory.AddOverwriteAsync(mappoolerStaffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Mappooler role created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating referee role...");
        var refereeStaffRole = await ctx.Guild.CreateRoleAsync($"{tournamentName}: Referee");
        await staffCategory.AddOverwriteAsync(refereeStaffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Referee role created!"));

        // Staff chat channel creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating staff chat channel...");
        var chatStaffChannel = await ctx.Guild.CreateTextChannelAsync("chat", staffCategory);
        await chatStaffChannel.AddOverwriteAsync(staffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Staff chat channel created!"));

        // Mappool channel creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating mappool channel...");
        var mappoolStaffChannel = await ctx.Guild.CreateTextChannelAsync("mappool", staffCategory);
        await mappoolStaffChannel.AddOverwriteAsync(staffRole, deny: Permissions.AccessChannels);
        await mappoolStaffChannel.AddOverwriteAsync(refereeStaffRole, deny: Permissions.AccessChannels);
        await mappoolStaffChannel.AddOverwriteAsync(mappoolerStaffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Mappool channel created!"));

        // Referee channels creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating referee channel...");
        var refereeStaffChannel = await ctx.Guild.CreateTextChannelAsync("referee", staffCategory);
        await refereeStaffChannel.AddOverwriteAsync(staffRole, deny: Permissions.AccessChannels);
        await refereeStaffChannel.AddOverwriteAsync(mappoolerStaffRole, deny: Permissions.AccessChannels);
        await refereeStaffChannel.AddOverwriteAsync(refereeStaffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Referee channel created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating results channel...");
        var refereeResultsStaffChannel = await ctx.Guild.CreateTextChannelAsync("results", staffCategory);
        await refereeResultsStaffChannel.AddOverwriteAsync(staffRole, deny: Permissions.AccessChannels);
        await refereeResultsStaffChannel.AddOverwriteAsync(mappoolerStaffRole, deny: Permissions.AccessChannels);
        await refereeResultsStaffChannel.AddOverwriteAsync(refereeStaffRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Results channel created!"));

        // Player category creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating player category...");
        var playersCategory = await ctx.Guild.CreateChannelCategoryAsync(tournamentName);
        await playersCategory.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Player category created!"));

        // Participant role creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating participant role...");
        var participantRole = await ctx.Guild.CreateRoleAsync($"{tournamentName}: Player");
        await playersCategory.AddOverwriteAsync(participantRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Participant role created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating captain role...");
        var captainRole = await ctx.Guild.CreateRoleAsync($"{tournamentName}: Captain");
        await playersCategory.AddOverwriteAsync(captainRole, Permissions.AccessChannels);
        await staffCategory.AddOverwriteAsync(captainRole, Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Captain role created!"));

        // Player channels creation.
        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating announcements channel...");
        var announcementsChannel = await ctx.Guild.CreateTextChannelAsync("anuncios", playersCategory);
        await announcementsChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await announcementsChannel.AddOverwriteAsync(participantRole, Permissions.AccessChannels);
        await announcementsChannel.AddOverwriteAsync(participantRole, deny: Permissions.SendMessages);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Announcements channel created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating dates channel...");
        var datesChannel = await ctx.Guild.CreateTextChannelAsync("fechas", playersCategory);
        await datesChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await datesChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.SendMessages);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Dates channel created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating links channel...");
        var linksChannel = await ctx.Guild.CreateTextChannelAsync("links", playersCategory);
        await linksChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await linksChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.SendMessages);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Links channel created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating schedules channel...");
        var schedulesChannel = await ctx.Guild.CreateTextChannelAsync("schedules", playersCategory);
        await schedulesChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await schedulesChannel.AddOverwriteAsync(participantRole, deny: Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Schedules channel created!"));

        statusMessage = await ctx.Channel.SendMessageAsync(":o: Creating chat channel...");
        var chatChannel = await ctx.Guild.CreateTextChannelAsync("chat", playersCategory);
        await chatChannel.AddOverwriteAsync(ctx.Guild.EveryoneRole, deny: Permissions.AccessChannels);
        await chatChannel.AddOverwriteAsync(participantRole, deny: Permissions.AccessChannels);
        await statusMessage.ModifyAsync(new Optional<string>(":white_check_mark: Chat channel created!"));
    }
    
    [DSharpPlus.CommandsNext.Attributes.Description("Moves all channels from a given category to another one and appends a prefix to the name of each channel.")]
    [Command("archivetournament")]
    [Aliases("archivet", "ac")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task ArchiveTournament(CommandContext ctx, ulong sourceCategoryId, ulong destinationCategoryId, string channelPrefix) {
        var source = ctx.Guild.GetChannel(sourceCategoryId);
        int count = 0;
        
        foreach (var channel in source.Children) {
            var currentChannelName = channel.Name;
            
            await channel.ModifyPositionAsync(1, parentId: destinationCategoryId);

            // Rate limit hack?
            await Task.Delay(250);
            
            await channel.ModifyAsync(model => {
                model.Name = $"{channelPrefix}-{currentChannelName}";
            });

            count++;
        }

        await ctx.RespondAsync($":white_check_mark: Successfully archived {count} channels to category {destinationCategoryId}");
    }


    [Command("formatbeatmap")]
    [Aliases("fbm")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task FormatBeatmap(CommandContext ctx, ulong mapId) {
        var beatmapData = await OsuClient.GetBeatmap(mapId);
        
        
        
    }
}