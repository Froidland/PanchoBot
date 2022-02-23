using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using DSharpPlus.EventArgs;
using PanchoBot.Api.v1.Requests;
using PanchoBot.Api.v2;

namespace PanchoBot.Commands;

public class OsuModule : BaseCommandModule {
    private static readonly OsuClient Client = Program._osuClient;

    [Command("beatmap")]
    [Aliases("map")]
    public async Task GetBeatmap(CommandContext ctx, string mapId) {
        if (mapId is null) {
            await ctx.RespondAsync("Please specify a map id.");
            return;
        }
        
        var beatmapData = Client.GetBeatmap(mapId).Result;

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
            IconUrl = $"http://s.ppy.sh/a/{beatmapData.Beatmapset?.UserId}"
        };
        #endregion
        
        // Send message.
        await ctx.RespondAsync(embedBuilder.Build());
    }

    [Command("recentscore")]
    [Aliases("recent", "rs")]
    public async Task GetRecentScore(CommandContext ctx, string username) {
        await ctx.RespondAsync("Not implemented yet!");
        /*var userId = Client.GetUser(username).Result.Id;
        
        var responseContent = Client.GetUserScores(userId.ToString(), "recent").Result.Content;
        
        await File.WriteAllTextAsync("score.txt", responseContent);
        Console.WriteLine(responseContent);*/

        /*var scoreData = await Client.GetUserScores(userId, "recent");
        if (scoreData is null) {
            await ctx.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }

        var embedBuilder = new DiscordEmbedBuilder();

        embedBuilder.Color = new Optional<DiscordColor>(DiscordColor.Aquamarine);
        embedBuilder.Url = $"https://osu.ppy.sh/beatmaps/{beatmapData.BeatmapId}";
        embedBuilder.Title = $"{beatmapData.Artist} - {beatmapData.Title} [{beatmapData.Version}]";

        // Description (Where most data goes).
        embedBuilder.Description = "**Rank\tScore\tAcc.\tWhen**\n" +
                                   $"{scoreData.Rank}\t{scoreData.Score}\tNaN\t{scoreData.Date}\n" +
                                   "**pp/PP\tCombo\tHits**\n" +
                                   $"NaN/NaN\t{scoreData.MaxCombo}/{beatmapData.MaxCombo}\t{{{scoreData.Count300} / {scoreData.Count100} / {scoreData.Count50} / {scoreData.CountMiss} }}\n" +
                                   "**Beatmap Information**\n" +
                                   $"Length: `{beatmapData.TotalLength}` (`{beatmapData.HitLength}`) " +
                                   $"BPM: `{beatmapData.Bpm}`" +
                                   $"FC: `{beatmapData.MaxCombo}x`\n" +
                                   $"CS: `{beatmapData.DiffSize}` " +
                                   $"AR: `{beatmapData.DiffApproach}` " +
                                   $"OD: `{beatmapData.DiffOverall}` " +
                                   $"HP: `{beatmapData.DiffDrain}` " +
                                   $"Stars: `{beatmapData.DifficultyRating}`";

        // Thumbnail.
        embedBuilder.Thumbnail = new DiscordEmbedBuilder.EmbedThumbnail {
            Url = $"https://b.ppy.sh/thumb/{beatmapData.BeatmapsetId}l.jpg"
        };

        // Author.
        embedBuilder.Author = new DiscordEmbedBuilder.EmbedAuthor {
            Name = userData.Username,
            Url = $"https://osu.ppy.sh/users/{userData.UserId}",
            IconUrl = $"http://s.ppy.sh/a/{userData.UserId}"
        };

        // Send message.
        await ctx.RespondAsync(embedBuilder.Build());*/
    }

    [Command("personalbest")]
    [Aliases("top", "pb")]
    public async Task GetPersonalBest(CommandContext ctx, string username) {
        var userData = Client.GetUser(username).Result;

        var userIdString = userData.Id.ToString();
        
        var userScoresData = Client.GetUserScores(userIdString, "best").Result;

        await ctx.RespondAsync($"{userScoresData[0].Beatmapset.Artist} - {userScoresData[0].Beatmapset.Title}\n" +
                               $"{userScoresData[0].ScoreCount} {userScoresData[0].Accuracy} {userScoresData[0].Pp}");
    }
}