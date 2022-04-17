using System;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using Microsoft.Extensions.Logging;
using MySqlConnector.Logging;
using PanchoBot.Api.v2;
using PanchoBot.Commands;
using PanchoBot.Database;
using Serilog;

namespace PanchoBot;

public class DiscordBot {
    private DiscordClient? DiscordClient { get; set; }
    public OsuClient? OsuClient { get; private set; }


    public async Task RunAsync(string discordToken, string osuClientId, string osuClientSecret, string databaseConnectionString) {
        var logFactory = new LoggerFactory().AddSerilog();
        MySqlConnectorLogManager.Provider = new SerilogLoggerProvider();
        DatabaseHandler.Configure(databaseConnectionString);

        OsuClient = new OsuClient(osuClientId, osuClientSecret);

        DiscordClient = new DiscordClient(new DiscordConfiguration {
            Token = discordToken,
            TokenType = TokenType.Bot,
            AutoReconnect = true,
            MinimumLogLevel = LogLevel.Debug,
            Intents = DiscordIntents.AllUnprivileged,
            LoggerFactory = logFactory
        });

        var commands = DiscordClient.UseCommandsNext(new CommandsNextConfiguration {
            StringPrefixes = new[] {"_"},
            EnableMentionPrefix = true
        });

        commands.RegisterCommands<OsuModule>();
        commands.RegisterCommands<TournamentModule>();
        commands.RegisterCommands<DatabaseModule>();

        DiscordClient.MessageCreated += (s, messageEvent) => {
            if (messageEvent.Guild.Id == 622600219233746974) Console.WriteLine(messageEvent.Message.Content);

            return null;
        };

        await DiscordClient.ConnectAsync();
        await Task.Delay(-1);
    }
}