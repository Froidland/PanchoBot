using DSharpPlus;
using DSharpPlus.CommandsNext;
using Microsoft.Extensions.Logging;
using MySqlConnector.Logging;
using PanchoBot.Discord.Api.v2;
using PanchoBot.Discord.Commands;
using PanchoBot.Discord.Database;
using Serilog;

namespace PanchoBot.Discord;

public class DiscordBot {
    private DiscordClient? DiscordClient { get; set; }
    public OsuClient? OsuClient { get; private set; }


    public async Task RunAsync(string discordToken, string osuClientId, string osuClientSecret,
        string databaseConnectionString) {
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

        /*DiscordClient.MessageCreated += async (s, messageEvent) => {
            switch (messageEvent.Guild.Id) {
                case 622600219233746974: {
                    Console.WriteLine(messageEvent.Message.Content);
                    break;
                }
                case 870106375269777418: {
                    var mutedRole = messageEvent.Guild.GetRole(875834341031301242);
                    if (messageEvent.Channel.Id == 872487113071943711 && !messageEvent.Author.IsCurrent) {
                        switch (messageEvent.Message.Content.ToLower()) {
                            case "ol": {
                                await messageEvent.Message.RespondAsync("ol");
                                break;
                            }
                            case "adiol": {
                                await messageEvent.Message.RespondAsync(
                                    DiscordEmoji.FromGuildEmote(s, 967332372301369366));
                                break;
                            }
                            default: {
                                await messageEvent.Message.DeleteAsync();
                                break;
                            }
                        }
                    }

                    break;
                }
            }
        };*/

        await DiscordClient.ConnectAsync();
        await Task.Delay(-1);
    }
}