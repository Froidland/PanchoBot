using System;
using System.Data.Common;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using PanchoBot.Api.v2;
using PanchoBot.Database;
using PanchoBot.Database.Models;

namespace PanchoBot.Commands;

public class OsuModule : BaseCommandModule {
    private static readonly OsuClient OsuClient = Program.Bot.OsuClient;

    [Command("link")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task Link(CommandContext ctx, string username) {
        DbUser? dbUser;

        var user = await OsuClient.GetUser(username);

        if (user is null) {
            await ctx.RespondAsync("Unable to get user data. Please try again later.");
            return;
        }

        if (user.Id == 0) {
            await ctx.Message.RespondAsync("Invalid username provided. Please try again with an existing username.");
            return;
        }

        try {
            dbUser = await DatabaseHandler.GetUser(ctx.User.Id);
        }
        catch (DbException exception) {
            await ctx.RespondAsync("Unable to query the database at this time. Please try again later.\n" +
                                   $"Error message: {exception.Message}");
            return;
        }

        if (dbUser is null) {
            var insertedRows = await DatabaseHandler.InsertUserAsync(ctx.User.Id, user.Id, user.Username);

            if (insertedRows == 0) {
                await ctx.RespondAsync("Unable to link username. Please try again later.");

                return;
            }

            await ctx.RespondAsync($"User `{username}` successfully linked to discord id `{ctx.User.Id}`.");

            return;
        }

        var updatedRows = await DatabaseHandler.UpdateUserAsync(ctx.User.Id, user.Id, user.Username);
        if (updatedRows == 0) {
            await ctx.RespondAsync("Unable to update already linked username. Please try again later.");
        }

        await ctx.RespondAsync($"User `{user.Username}` successfully updated to discord id `{ctx.User.Id}`.");
    }

    [Command("beatmap")]
    [Aliases("map")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task GetBeatmap(CommandContext ctx, ulong mapId) {
        var beatmapData = await OsuClient.GetBeatmap(mapId);

        if (beatmapData is null) {
            await ctx.RespondAsync("Map not found or the osu! api threw an error.");
            return;
        }

        #region GetBeatmapMessageFormatting

        var embedBuilder = new DiscordEmbedBuilder();

        var beatmapTotalLengthTimeSpan = new TimeSpan(0, 0, beatmapData.TotalLength);
        var beatmapHitLengthTimeSpan = new TimeSpan(0, 0, beatmapData.HitLength);

        embedBuilder.Color = new Optional<DiscordColor>(DiscordColor.Aquamarine);
        embedBuilder.Url = $"https://osu.ppy.sh/beatmaps/{beatmapData.Id}";
        embedBuilder.Title = $"{beatmapData.Beatmapset?.Artist} - {beatmapData.Beatmapset?.Title}";

        // Description (Where most data goes).
        embedBuilder.Description = $"**[{beatmapData.Version}]**\n" +
                                   $"Length: `{beatmapTotalLengthTimeSpan.ToString(@"mm\:ss")}` (`{beatmapHitLengthTimeSpan.ToString(@"mm\:ss")}`) " +
                                   $"BPM: `{beatmapData.Bpm}` " +
                                   $"FC: `{beatmapData.MaxCombo}x`\n" +
                                   $"CS: `{beatmapData.Cs}` " +
                                   $"AR: `{beatmapData.Ar}` " +
                                   $"OD: `{beatmapData.Accuracy}` " +
                                   $"HP: `{beatmapData.Drain}` " +
                                   $"Stars: `{beatmapData.DifficultyRating}`\n";

        // Thumbnail.
        embedBuilder.Thumbnail = new DiscordEmbedBuilder.EmbedThumbnail {
            Url = $"https://b.ppy.sh/thumb/{beatmapData.BeatmapsetId}l.jpg"
        };

        // Author.
        embedBuilder.Author = new DiscordEmbedBuilder.EmbedAuthor {
            Name = $"{beatmapData.Beatmapset?.Creator}",
            Url = $"https://osu.ppy.sh/users/{beatmapData.Beatmapset?.UserId}",
            IconUrl = $"https://s.ppy.sh/a/{beatmapData.Beatmapset?.UserId}"
        };

        #endregion

        // Send message.
        await ctx.RespondAsync(embedBuilder.Build());
    }

    [Command("recentscore")]
    [Aliases("recent", "rs")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task GetRecentScore(CommandContext ctx, string username) {
        var userData = await OsuClient.GetUser(username);

        if (userData is null) {
            await ctx.RespondAsync("User invalid or there was an error obtaining the specified user.");
            return;
        }

        var scoreData = await OsuClient.GetUserScores(userData.Id, "recent");

        if (scoreData?.Length == 0) {
            await ctx.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }

        var beatmapData = scoreData![0].Beatmap!;

        //TODO: Create an embed for this

        await ctx.RespondAsync($"{scoreData[0].Beatmapset!.Artist} - {scoreData[0].Beatmapset!.Title}\n" +
                               $"{scoreData[0].ScoreCount} {scoreData[0].Accuracy * 100} {scoreData[0].Pp}");
    }

    //TODO: Make this a pretty embed.
    [Command("personalbest")]
    [Aliases("top", "pb")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task GetPersonalBest(CommandContext ctx, string username) {
        var userData = await OsuClient.GetUser(username);

        if (userData is null) {
            await ctx.Message.RespondAsync("Invalid username.");
            return;
        }

        var scoreData = await OsuClient.GetUserScores(userData.Id, "best");

        if (scoreData is null) {
            await ctx.Message.RespondAsync("Couldn't find any score data.");
            return;
        }

        await ctx.RespondAsync($"{scoreData[0].Beatmapset!.Artist} - {scoreData[0].Beatmapset!.Title}\n" +
                               $"{scoreData[0].ScoreCount} {scoreData[0].Accuracy * 100} {scoreData[0].Pp}");
    }

    [Command("personalbest")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task GetPersonalBest(CommandContext ctx) {
        var user = await DatabaseHandler.GetUser(ctx.Message.Author.Id);

        if (user is null) {
            await ctx.Message.RespondAsync(
                "Please link your discord account to a username or explicitly indicate a username with the appropiate command.");
            return;
        }

        var scoreData = await OsuClient.GetUserScores(user.OsuId, "best");


        await ctx.RespondAsync($"{scoreData?[0].Beatmapset!.Artist} - {scoreData?[0].Beatmapset!.Title}\n" +
                               $"{scoreData?[0].ScoreCount} {scoreData?[0].Accuracy * 100} {scoreData?[0].Pp}");
    }
}