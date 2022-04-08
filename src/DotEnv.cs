using System;
using System.Collections.Generic;
using System.IO;
using Serilog;

namespace PanchoBot;

public static class DotEnv {
    /// <summary>
    /// Loads all environment variables from a .env file.
    /// </summary>
    /// <param name="filePath">Path to the .env file.</param>
    /// <returns>True if the specified .env file exists, false otherwise.</returns>
    public static bool Load(string filePath) {
        if (!File.Exists(filePath)) {
            Log.Error("No .env file found in the app directory");
            return false;
        }

        Log.Debug("Loading environment variables from {FilePath}", filePath);

        foreach (var line in File.ReadAllLines(filePath)) {
            var parts = line.Split(
                '=',
                StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length != 2)
                continue;

            Log.Debug("Adding environment variable {Variable}", parts[0]);
            Environment.SetEnvironmentVariable(parts[0], parts[1]);
        }

        return true;
    }

    /// <summary>
    /// Checks whether there is a missing environment variable for the bot to correctly work.
    /// </summary>
    /// <returns>True if there are no variables missing, false otherwise.</returns>
    public static bool CheckMissingVariables() {
        var list = new List<string>();

        var osuClientId = Environment.GetEnvironmentVariable("OSU_CLIENT_ID");
        var osuClientSecret = Environment.GetEnvironmentVariable("OSU_CLIENT_SECRET");
        var discordToken = Environment.GetEnvironmentVariable("DISCORD_TOKEN");
        var databaseIp = Environment.GetEnvironmentVariable("DATABASE_IP");
        var databaseUsername = Environment.GetEnvironmentVariable("DATABASE_USERNAME");
        var databasePassword = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");
        var databaseName = Environment.GetEnvironmentVariable("DATABASE_NAME");

        if (string.IsNullOrEmpty(osuClientId)) {
            list.Add("OSU_CLIENT_ID");
        }

        if (string.IsNullOrEmpty(osuClientSecret)) {
            list.Add("OSU_CLIENT_SECRET");
        }

        if (string.IsNullOrEmpty(discordToken)) {
            list.Add("DISCORD_TOKEN");
        }

        if (string.IsNullOrEmpty(databaseIp)) {
            list.Add("DATABASE_IP");
        }

        if (string.IsNullOrEmpty(databaseUsername)) {
            list.Add("DATABASE_USERNAME");
        }

        if (string.IsNullOrEmpty(databasePassword)) {
            list.Add("DATABASE_PASSWORD");
        }

        if (string.IsNullOrEmpty(databaseName)) {
            list.Add("DATABASE_NAME");
        }

        if (list.Count == 0) {
            return true;
        }

        Log.Error("Please specify the following environment variables in a .env file: {Variables}", string.Join(", ", list));
        return false;
    }
}
