using System;
using System.IO;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using PanchoBot.Api.v2;
using PanchoBot.Commands;
using PanchoBot.Database;

namespace PanchoBot;

public static class Program {
    public static string ApiKey = "f417bb502c5191951befbbfc49099dfea4bc8736";
    public static OsuClient _osuClient;

    public static void Main() {
        MainAsync().GetAwaiter().GetResult();
    }

    private static async Task MainAsync() {
        // Environment variables.
        var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
        DotEnv.Load(envPath);

        var osuClientId = Environment.GetEnvironmentVariable("OSU_CLIENT_ID");
        var osuClientSecret = Environment.GetEnvironmentVariable("OSU_CLIENT_SECRET");
        var discordToken = Environment.GetEnvironmentVariable("DISCORD_TOKEN");
        var databaseIp = Environment.GetEnvironmentVariable("DATABASE_IP");
        var databaseUsername = Environment.GetEnvironmentVariable("DATABASE_USERNAME");
        var databasePassword = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");
        var databaseName = Environment.GetEnvironmentVariable("DATABASE_NAME");

        if (string.IsNullOrEmpty(osuClientId) || string.IsNullOrEmpty(osuClientSecret)) {
            Console.WriteLine("Please specify the following environment variables in a .env file: ");
            Console.WriteLine("OSU_CLIENT_ID, OSU_CLIENT_SECRET");
            return;
        }

        if (string.IsNullOrEmpty(discordToken)) {
            Console.WriteLine("Please specify the following environment variables in a .env file: ");
            Console.WriteLine("DISCORD_TOKEN");
            return;
        }

        if (string.IsNullOrEmpty(databaseIp) || string.IsNullOrEmpty(databaseUsername) ||
            string.IsNullOrEmpty(databasePassword) || string.IsNullOrEmpty(databaseName)) {
            Console.WriteLine("Please specify the following environment variables in a .env file: ");
            Console.WriteLine("DATABASE_IP, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME");
            return;
        }

        _osuClient = new OsuClient(osuClientId, osuClientSecret);

        var discordClient = new DiscordClient(new DiscordConfiguration {
            Token = discordToken,
            TokenType = TokenType.Bot,
            Intents = DiscordIntents.AllUnprivileged
        });

        await DatabaseHandler.Connect(databaseIp, databaseUsername, databasePassword, databaseName);

        var commands = discordClient.UseCommandsNext(new CommandsNextConfiguration {
            StringPrefixes = new[] {"_"}
        });

        commands.RegisterCommands<OsuModule>();
        commands.RegisterCommands<MiscellaneousModule>();

        /*discordClient.GuildMemberAdded += async (s, memberJoinEvent) => {
            if (await DatabaseHandler.GetUser(memberJoinEvent.Member.Id) is not null) {
                await memberJoinEvent.Member.SendMessageAsync(
                    $"You are already verified on server {memberJoinEvent.Guild.Name}");
            }
        };*/

        await discordClient.ConnectAsync();
        await Task.Delay(-1);
    }
}