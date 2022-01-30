using System;
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
        var beatmapData = Client.GetBeatmap(mapId).Result;

        if (mapId is null) {
            await ctx.RespondAsync("Please specify a map id.");
            return;
        }

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
    public async Task GetRecentScore(CommandContext ctx, string userId) {
        await ctx.RespondAsync("Not implemented yet!");
        
        /*var scoreData = await GetRecentScore.SendRequest(osuClient, apiKey, userId);
        if (scoreData is null) {
            await ctx.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }

        var beatmapData = await GetBeatmap.SendRequest(osuClient, apiKey, scoreData?.BeatmapId);
        if (beatmapData is null) {
            await ctx.RespondAsync("Map not found or the osu! api threw an error.");
            return;
        }

        var userData = await GetUser.SendRequest(osuClient, apiKey, userId);
        if (userData is null) {
            await ctx.RespondAsync("User not found or the osu! api threw an error.");
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
}