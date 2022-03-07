using System;
using System.Threading.Tasks;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using PanchoBot.Api.v2;
using PanchoBot.Database;

namespace PanchoBot.Commands;

public class OsuModule : BaseCommandModule {
    private static readonly OsuClient Client = Program._osuClient;
    [Command("link")]
    public async Task Link(CommandContext ctx, string username) {
        Exception? exception;
        
        var user = await Client.GetUser(username);
        if (user is null) {
            await ctx.Message.RespondAsync("Invalid username provided.");
            return;
        }

        var dbUser = await DatabaseHandler.GetUser(ctx.Message.Author.Id);
        if (dbUser is not null) {
            exception = await DatabaseHandler.UpdateUser(ctx.Message.Author.Id, user.Id, username);

            if (exception is not null) {
                await ctx.Message.RespondAsync($"Unable to link osu! username `{username}`.\n" +
                                               $"Error message: {exception.Message}");
                return;
            }
            
            await ctx.Message.RespondAsync($"User `{username}` linked to discord id `{ctx.Message.Author.Id}`.");
            return;
        }
        
        exception = await DatabaseHandler.AddUser(ctx.Message.Author.Id, user.Id, username);
        if (exception is not null) {
            await ctx.Message.RespondAsync($"Unable to link osu! username `{username}`.\n" +
                                           $"Error message: {exception.Message}");
            return;
        }
        
        await ctx.Message.RespondAsync($"User `{username}` linked to discord id `{ctx.Message.Author.Id}`.");
    }

    [Command("beatmap")]
    [Aliases("map")]
    public async Task GetBeatmap(CommandContext ctx, string mapId) {
        var beatmapData = await Client.GetBeatmap(mapId);

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
    
    //TODO: Actually make this work somehow lol.
    [Command("recentscore")]
    [Aliases("recent", "rs")]
    public async Task GetRecentScore(CommandContext ctx, string username) {
        var userData = await Client.GetUser(username);

        if (userData is null) {
            await ctx.RespondAsync("User invalid or there was an error obtaining the specified user.");
            return;
        }
        
        var scoreData = await Client.GetUserScores(userData.Id, "recent");

        if (scoreData?.Length == 0) {
            await ctx.RespondAsync("Score not found or the osu! api threw an error.");
            return;
        }
        
        var beatmapData = scoreData![0].Beatmap!;

        var embedBuilder = new DiscordEmbedBuilder {
            Color = new Optional<DiscordColor>(DiscordColor.Aquamarine),
            Url = $"https://osu.ppy.sh/beatmaps/{beatmapData.Id}",
            Title = $"{beatmapData.Beatmapset!.Artist} - {beatmapData.Beatmapset.Title} [{beatmapData.Version}]",
            // Description (Where most data goes).
            Description = "**Rank\tScore\tAcc.\tWhen**\n" +
                          $"{scoreData[0].Rank}\t{scoreData[0].ScoreCount}\tNaN\t{scoreData[0].CreatedAt}\n" +
                          "**pp/PP\tCombo\tHits**\n" +
                          $"NaN/NaN\t{scoreData[0].MaxCombo}/{beatmapData.MaxCombo}\t{{{scoreData[0].Statistics!.Count300} / {scoreData[0].Statistics!.Count100} / {scoreData[0].Statistics!.Count50} / {scoreData[0].Statistics!.CountMiss} }}\n" +
                          "**Beatmap Information**\n" +
                          $"Length: `{beatmapData.TotalLength}` (`{beatmapData.HitLength}`) " +
                          $"BPM: `{beatmapData.Bpm}`" +
                          $"FC: `{beatmapData.MaxCombo}x`\n" +
                          $"CS: `{beatmapData.Cs}` " +
                          $"AR: `{beatmapData.Ar}` " +
                          $"OD: `{beatmapData.Accuracy}` " +
                          $"HP: `{beatmapData.Drain}` " +
                          $"Stars: `{beatmapData.DifficultyRating}`",
            // Thumbnail.
            Thumbnail = new DiscordEmbedBuilder.EmbedThumbnail {
                Url = $"https://b.ppy.sh/thumb/{beatmapData.BeatmapsetId}l.jpg"
            },
            // Author.
            Author = new DiscordEmbedBuilder.EmbedAuthor {
                Name = userData.Username,
                Url = $"https://osu.ppy.sh/users/{userData.Id}",
                IconUrl = $"https://s.ppy.sh/a/{userData.Id}"
            }
        };

        // Send message.
        await ctx.RespondAsync(embedBuilder.Build());
    }

    //TODO: Make this a pretty embed.
    [Command("personalbest")]
    [Aliases("top", "pb")]
    public async Task GetPersonalBest(CommandContext ctx, string username) {
        var userData = await Client.GetUser(username);

        if (userData is null) {
            await ctx.Message.RespondAsync("Invalid username.");
            return;
        }
        
        var scoreData = await Client.GetUserScores(userData.Id, "best");

        if (scoreData is null) {
            await ctx.Message.RespondAsync("Couldn't find any score data.");
            return;
        }

        await ctx.RespondAsync($"{scoreData[0].Beatmapset!.Artist} - {scoreData[0].Beatmapset!.Title}\n" + 
                               $"{scoreData[0].ScoreCount} {scoreData[0].Accuracy * 100} {scoreData[0].Pp}");
    }
    
    [Command("personalbest")]
    public async Task GetPersonalBest(CommandContext ctx) {
        var user = await DatabaseHandler.GetUser(ctx.Message.Author.Id);

        if (user is null) {
            await ctx.Message.RespondAsync(
                "Please link your discord account to a username or explicitly indicate a username with the appropiate command.");
            return;
        }

        var scoreData = await Client.GetUserScores(user.OsuId, "best");


        await ctx.RespondAsync($"{scoreData?[0].Beatmapset!.Artist} - {scoreData?[0].Beatmapset!.Title}\n" +
                               $"{scoreData?[0].ScoreCount} {scoreData?[0].Accuracy * 100} {scoreData?[0].Pp}");
    }
}