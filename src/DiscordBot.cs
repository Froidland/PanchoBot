using System;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using Microsoft.Extensions.Logging;
using PanchoBot.Api.v2;
using PanchoBot.Commands;

namespace PanchoBot;

public class DiscordBot {
    private DiscordClient? DiscordClient { get; set; }
    public OsuClient? OsuClient { get; private set; }

    public async Task RunAsync(string discordToken, string osuClientId, string osuClientSecret) {
        OsuClient = new OsuClient(osuClientId, osuClientSecret);

        DiscordClient = new DiscordClient(new DiscordConfiguration {
            Token = discordToken,
            TokenType = TokenType.Bot,
            AutoReconnect = true,
            MinimumLogLevel = LogLevel.Debug,
            Intents = DiscordIntents.AllUnprivileged
        });

        var commands = DiscordClient.UseCommandsNext(new CommandsNextConfiguration {
            StringPrefixes = new[] {"_"},
            EnableMentionPrefix = true
        });

        commands.RegisterCommands<OsuModule>();
        commands.RegisterCommands<MiscellaneousModule>();
        commands.RegisterCommands<TournamentModule>();

        DiscordClient.MessageCreated += (s, messageEvent) => {
            if (messageEvent.Guild.Id == 622600219233746974) Console.WriteLine(messageEvent.Message.Content);

            return null;
        };

        await DiscordClient.ConnectAsync();
        await Task.Delay(-1);
    }
}