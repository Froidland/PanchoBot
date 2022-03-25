using System;
using System.Threading.Tasks;
using MySqlConnector;
using PanchoBot.Database.Models;

namespace PanchoBot.Database;

public static class DatabaseHandler {
    private static MySqlConnection? _connection;

    /// <summary>
    /// Connects to a database server and assigns this class' _connection variable to the connection obtained from this method.
    /// </summary>
    /// <param name="ip">IP of the database server.</param>
    /// <param name="username">Username to access the database server.</param>
    /// <param name="password">Password to access the database server.</param>
    /// <param name="database">Database name to work with in the database server.</param>
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
    /// Inserts a given user into the database's "users" table.
    /// </summary>
    /// <param name="discordId">The player's Discord ID.</param>
    /// <param name="osuId">The player's osu! ID.</param>
    /// <param name="osuUsername">The player's osu! username.</param>
    /// <returns>The amount of rows affected.</returns>
    /// <exception cref="System.Data.Common.DbException">Thrown when executing the sql command fails.</exception>
    public static async Task<int> InsertUserAsync(ulong discordId, int osuId, string osuUsername) {
        await using var cmd = new MySqlCommand(
            $"insert into users (discord_id, osu_id, osu_username) values ({discordId}, {osuId}, '{osuUsername}')",
            _connection);

        return await cmd.ExecuteNonQueryAsync();
    }

    /// <summary>
    /// Updates the data corresponding to a user in the database's "users" table.
    /// </summary>
    /// <param name="discordId">The player's Discord ID.</param>
    /// <param name="osuId">The player's osu! ID.</param>
    /// <param name="osuUsername">The player's osu! username.</param>
    /// <returns>The amount of rows affected.</returns>
    /// <exception cref="System.Data.Common.DbException">Thrown when executing the sql command fails.</exception>
    public static async Task<int> UpdateUserAsync(ulong discordId, int osuId, string osuUsername) {
        await using var cmd =
            new MySqlCommand(
                $"update users set osu_id = {osuId}, osu_username = '{osuUsername}' where discord_id = {discordId}",
                _connection);

        return await cmd.ExecuteNonQueryAsync();
    }

    /// <summary>
    /// Gets a row of data corresponding to the discordId in the database's "users" table.
    /// </summary>
    /// <param name="discordId"></param>
    /// <returns>The data returned by the database if found, otherwise returns null.</returns>
    /// <exception cref="System.Data.Common.DbException">Thrown when executing the sql command fails.</exception>
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