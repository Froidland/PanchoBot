using System.Data.Common;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using PanchoBot.Discord.Api.v2;
using PanchoBot.Discord.Api.v2.Models;
using PanchoBot.Discord.Database;
using PanchoBot.Discord.Database.Models;
using Serilog;

namespace PanchoBot.Discord.Commands;

public class OsuModule : BaseCommandModule {
    private static readonly OsuClient OsuClient = Program.Bot.OsuClient!;

    [Command("link")]
    [RequireOwner]
    public async Task Link(CommandContext ctx, string username) {
        DbUser? dbUser;

        var user = await OsuClient.GetUser(username);

        if (user is null) {
            await ctx.Message.RespondAsync("Invalid username provided. Please try again with an existing username.");
            return;
        }

        try {
            dbUser = await DatabaseHandler.SelectUserAsync(ctx.User.Id);
        }
        catch (DbException exception) {
            Log.Error(exception, "Error when querying the database");
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
            return;
        }

        await ctx.RespondAsync($"User `{user.Username}` successfully updated to discord id `{ctx.User.Id}`.");
    }

    [Command("beatmap")]
    [Aliases("map")]
    [RequireOwner]
    public async Task GetBeatmap(CommandContext ctx, ulong mapId) {
        var beatmapData = await OsuClient.GetBeatmap(mapId);

        if (beatmapData is null) {
            await ctx.RespondAsync("Map not found or the osu! api threw an error.");
            return;
        }

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

        // Send message.
        await ctx.RespondAsync(embedBuilder.Build());
    }

    [Command("recentscore")]
    [Aliases("recent", "rs")]
    [RequireOwner]
    public async Task GetRecentScore(CommandContext ctx, string username = "") {
        User? userData;
        Score[]? scoresData;
        var userId = 0;

        if (string.IsNullOrEmpty(username)) {
            var dbQuery = await DatabaseHandler.SelectUserAsync(ctx.User.Id);

            if (dbQuery is null) {
                await ctx.RespondAsync("Please link your account to execute this command without arguments.");
                return;
            }

            userId = dbQuery.OsuId;
            username = dbQuery.OsuUsername;
        }


        userData = await OsuClient.GetUser(username);

        if (userData is null) {
            await ctx.RespondAsync("Unable to obtain user data.");
            return;
        }

        if (userId != 0)
            scoresData = await OsuClient.GetUserScores(userId, "recent");
        else
            scoresData = await OsuClient.GetUserScores(userData.Id, "recent");

        if (scoresData is null) {
            await ctx.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }

        if (scoresData.Length == 0) {
            await ctx.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }

        var scoreData = scoresData[0];
        var beatmapData = scoreData.Beatmap;
        var beatmapsetData = scoreData.Beatmapset;

        if (beatmapData is null) {
            await ctx.RespondAsync("Invalid map.");
            return;
        }

        if (beatmapsetData is null) {
            await ctx.RespondAsync("Invalid beatmapset.");
            return;
        }


        //TODO: Create an embed for this

        var embedBuilder = new DiscordEmbedBuilder();

        var beatmapTotalLengthTimeSpan = new TimeSpan(0, 0, beatmapData.TotalLength);
        var beatmapHitLengthTimeSpan = new TimeSpan(0, 0, beatmapData.HitLength);

        embedBuilder.Color = new Optional<DiscordColor>(DiscordColor.Aquamarine);
        embedBuilder.Url = $"https://osu.ppy.sh/beatmaps/{beatmapData.Id}";
        embedBuilder.Title = $"{beatmapsetData.Artist} - {beatmapsetData.Title}";

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
            Name =
                $"{userData.Username}: {userData.Statistics.Pp}pp (#{userData.Statistics.GlobalRank} {userData.Country.Code}{userData.Statistics.Rank.Country})",
            Url = $"https://osu.ppy.sh/users/{userData.Id}",
            IconUrl = $"https://s.ppy.sh/a/{userData.Id}"
        };

        await ctx.RespondAsync(embedBuilder.Build());
    }

    //TODO: Make this a pretty embed.
    [Command("personalbest")]
    [Aliases("top", "pb")]
    [RequireOwner]
    public async Task GetPersonalBest(CommandContext ctx, [RemainingText] string username = "") {
        User? userData;
        var userId = 0;

        if (string.IsNullOrEmpty(username)) {
            var dbQuery = await DatabaseHandler.SelectUserAsync(ctx.User.Id);

            if (dbQuery is null) {
                await ctx.RespondAsync("Please link an account to your discord profile or specify a username.");
                return;
            }

            userId = dbQuery.OsuId;
        }

        if (userId == 0) {
            userData = await OsuClient.GetUser(username);

            if (userData is null) {
                await ctx.Message.RespondAsync("Invalid username.");
                return;
            }

            userId = userData.Id;
        }


        var scoreData = await OsuClient.GetUserScores(userId, "best");

        if (scoreData is null) {
            await ctx.Message.RespondAsync("Couldn't find any score data.");
            return;
        }

        await ctx.RespondAsync($"{scoreData[0].Beatmapset!.Artist} - {scoreData[0].Beatmapset!.Title}\n" +
                               $"{scoreData[0].ScoreCount} {scoreData[0].Accuracy * 100} {scoreData[0].Pp}");
    }
}