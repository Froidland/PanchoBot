using System;
using System.IO;
using Serilog;

namespace PanchoBot;

public static class Program {
    public static DiscordBot Bot;

    public static void Main() {
        Log.Logger = new LoggerConfiguration().MinimumLevel
            .Debug()
            .WriteTo.Console()
            .WriteTo.File("logs/log.log", rollingInterval: RollingInterval.Day)
            .CreateLogger();


        var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
        var envExists = DotEnv.Load(envPath);


        if (!envExists || !DotEnv.CheckMissingVariables()) {
            return;
        }

        var osuClientId = Environment.GetEnvironmentVariable("OSU_CLIENT_ID");
        var osuClientSecret = Environment.GetEnvironmentVariable("OSU_CLIENT_SECRET");
        var discordToken = Environment.GetEnvironmentVariable("DISCORD_TOKEN");
        var databaseIp = Environment.GetEnvironmentVariable("DATABASE_IP");
        var databaseUsername = Environment.GetEnvironmentVariable("DATABASE_USERNAME");
        var databasePassword = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");
        var databaseName = Environment.GetEnvironmentVariable("DATABASE_NAME");

        var databaseConnectionString =
            $"Server={databaseIp};User ID={databaseUsername};Password={databasePassword};Database={databaseName}";

        Bot = new DiscordBot();
        Bot.RunAsync(discordToken!, osuClientId!, osuClientSecret!, databaseConnectionString).GetAwaiter().GetResult();
    }
}
