using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.Net.Models;
using Emzi0767;
using PanchoBot.Api.v2;
using PanchoBot.Commands;

namespace PanchoBot; 

public static class Program {
    public static string ApiKey = "f417bb502c5191951befbbfc49099dfea4bc8736";
    public static readonly OsuClient _osuClient = new OsuClient("3639", "mkoNqUJdyaTLwZWK1qrDEZvKQZTMx7dQAvEHbH6S");
    public static DateTime? TokenExpirationDateTime = null;

    public static void Main() {
        MainAsync().GetAwaiter().GetResult();
    }

    private static async Task MainAsync() {
        var discordClient = new DiscordClient(new DiscordConfiguration() {
            Token = "NTcwNDQyODIwNzA0MjcyMzg0.XL_QRg.SLoO-VcWsM7IpUgYsxFVh6j5HLg",
            TokenType = TokenType.Bot,
            Intents = DiscordIntents.AllUnprivileged
        });

        var commands = discordClient.UseCommandsNext(new CommandsNextConfiguration() {
            StringPrefixes = new[] {"_"}
        });
        
        commands.RegisterCommands<OsuModule>();

        /*discordClient.MessageCreated += async (s, messageEvent) => {
            if (messageEvent.Message.Content.StartsWith("_")) {
                var commandArgs = messageEvent.Message.Content.Split(" ");

                switch (commandArgs[0]) {
                    case "_map" : {
                        await Deprecated.Commands.RespondBeatmap(_osuClient, messageEvent, commandArgs[1]);
                        break;
                    }
                    /*case "_rs": {
                        await Commands.RespondRecentPlay(_osuClient, messageEvent, ApiKey, commandArgs[1]);
                        break;
                    }
                    case "_user": {
                        await Commands.RespondUser(_osuClient, messageEvent, commandArgs[1]);
                        break;
                    }#1#
                    default : {
                        await messageEvent.Message.RespondAsync("Unknown command.");
                        break;
                    }
                }
            }
        };*/
            
        await discordClient.ConnectAsync();
        await Task.Delay(-1);
    }
}