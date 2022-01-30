using System;
using System.Net.Http;
using System.Threading.Tasks;
using DSharpPlus.Entities;
using DSharpPlus.EventArgs;
using PanchoBot.Api.v1.Requests;
using PanchoBot.Api.v2;

namespace PanchoBot.Deprecated;

public static class Commands {
    public static async Task RespondRecentPlay(HttpClient osuClient, MessageCreateEventArgs messageEvent, string apiKey, string userId) {
        var scoreData = await GetRecentScore.SendRequest(osuClient, apiKey, userId);
        if (scoreData is null) {
            await messageEvent.Message.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }

        var beatmapData = await GetBeatmap.SendRequest(osuClient, apiKey, scoreData?.BeatmapId);
        if (beatmapData is null) {
            await messageEvent.Message.RespondAsync("Map not found or the osu! api threw an error.");
            return;
        }

        var userData = await GetUser.SendRequest(osuClient, apiKey, userId);
        if (userData is null) {
            await messageEvent.Message.RespondAsync("User not found or the osu! api threw an error.");
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
        await messageEvent.Message.RespondAsync(embedBuilder.Build());
    }

    public static async Task RespondUser(OsuClient osuClient, MessageCreateEventArgs messageEvent, string userId) {
        var userData = osuClient.GetUser(userId);

        if (userData is null) {
            await messageEvent.Message.RespondAsync("User not found!");
            return;
        }

        //StringBuilder stringResponse = new StringBuilder();

        //stringResponse.Append($"{userData.Username}\n{userData.Statistics.Pp}\n{userData.Country.Name}");
    }
}