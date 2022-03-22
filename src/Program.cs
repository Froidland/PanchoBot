using System;
using System.IO;
using System.Threading.Tasks;
using PanchoBot.Database;

namespace PanchoBot;

public static class Program {
    public static DiscordBot? Bot;

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

        await DatabaseHandler.Connect(databaseIp, databaseUsername, databasePassword, databaseName);

        Bot = new DiscordBot();
        Bot.RunAsync(discordToken, osuClientId, osuClientSecret).GetAwaiter().GetResult();
    }
}