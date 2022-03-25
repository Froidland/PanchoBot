using System;
using System.Threading.Tasks;
using MySqlConnector;
using PanchoBot.Database.Models;

namespace PanchoBot.Database;

public static class DatabaseHandler {
    private static MySqlConnection? _connection;

    public static async Task ConnectAsync(string ip, string username, string password, string database) {
        var connection = new MySqlConnection($"Server={ip};User ID={username};Password={password};Database={database}");

        try {
            Console.WriteLine("Establishing connection with the database.");
            await connection.OpenAsync();
            Console.WriteLine("Database connection successful.");
        }
        catch (MySqlException e) {
            Console.WriteLine(e.Message);
            await connection.DisposeAsync();
            _connection = null;
            return;
        }

        _connection = connection;
    }

    /// <summary>
    /// Insert a given user to the database into the users table.
    /// </summary>
    /// <param name="discordId">The player's Discord ID.</param>
    /// <param name="osuId">The player's osu! ID.</param>
    /// <param name="osuUsername">The player's osu! username.</param>
    public static async Task<int> InsertUserAsync(ulong discordId, int osuId, string osuUsername) {
        await using var cmd = new MySqlCommand(
            $"insert into users (discord_id, osu_id, osu_username) values ({discordId}, {osuId}, '{osuUsername}')",
            _connection);

        return await cmd.ExecuteNonQueryAsync();
    }

    public static async Task<int> UpdateUserAsync(ulong discordId, int osuId, string osuUsername) {
        await using var cmd =
            new MySqlCommand(
                $"update users set osu_id = {osuId}, osu_username = '{osuUsername}' where discord_id = {discordId}",
                _connection);

        return await cmd.ExecuteNonQueryAsync();
    }

    public static async Task<DbUser?> GetUser(ulong discordId) {
        await using var cmd = new MySqlCommand($"select * from users where discord_id = {discordId}", _connection);
        await using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync()) {
            return new DbUser(reader.GetUInt64("discord_id"), reader.GetInt32("osu_id"),
                reader.GetString("osu_username"));
        }

        return null;
    }
}