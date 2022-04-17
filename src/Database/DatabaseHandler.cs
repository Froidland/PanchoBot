using System;
using System.Data;
using System.Threading.Tasks;
using MySqlConnector;
using PanchoBot.Database.Models;
using Serilog;

namespace PanchoBot.Database;

public static class DatabaseHandler {
    private static string _connectionString = string.Empty;

    public static void Configure(string connectionString) {
        _connectionString = connectionString;
    }

    /// <summary>
    /// Connects to a database server and assigns this class' _connection variable to the connection obtained from this method.
    /// </summary>
    /// <param name="connectionString">Connection string for the database.</param>
    private static async Task<MySqlConnection?> ConnectAsync(string connectionString) {
        var connection = new MySqlConnection(connectionString);

        try {
            await connection.OpenAsync();
        }
        catch (MySqlException e) {
            Log.Error("Error message: {ErrorMessage}", e.Message);
            await connection.DisposeAsync();
            return null;
        }

        return connection;
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
        var cmdText =
            "insert into users (discord_id, osu_id, osu_username) values (@discordId, @osuId, @osuUsername)";
        await using var connection = await ConnectAsync(_connectionString);
        await using var cmd = new MySqlCommand(cmdText, connection);

        cmd.Parameters.Add("@discordId", DbType.UInt64);
        cmd.Parameters["@discordId"].Value = discordId;
        cmd.Parameters.Add("@osuId", DbType.Int32);
        cmd.Parameters["@osuId"].Value = osuId;
        cmd.Parameters.Add("@osuUsername", MySqlDbType.Text, 32);
        cmd.Parameters["@osuUsername"].Value = osuUsername;

        try {
            return await cmd.ExecuteNonQueryAsync();
        }
        catch (Exception exception) {
            Log.Error("Exception occurred: {ExceptionMessage}", exception.Message);
            return 0;
        }
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
        var cmdText =
            "update users set osu_id = @osuId, osu_username = @osuUsername where discord_id = @discordId";
        await using var connection = await ConnectAsync(_connectionString);
        await using var cmd = new MySqlCommand(cmdText, connection);

        cmd.Parameters.Add("@discordId", DbType.UInt64);
        cmd.Parameters.Add("@osuId", DbType.Int32);
        cmd.Parameters.Add("@osuUsername", DbType.String);
        cmd.Parameters["@discordId"].Value = discordId;
        cmd.Parameters["@osuId"].Value = osuId;
        cmd.Parameters["@osuUsername"].Value = osuUsername;

        try {
            return await cmd.ExecuteNonQueryAsync();
        }
        catch (Exception exception) {
            Log.Error("Exception occurred: {ExceptionMessage}", exception.Message);
            return 0;
        }
    }


    /// <summary>
    /// Gets a row of data corresponding to the discordId in the database's "users" table.
    /// </summary>
    /// <param name="discordId"></param>
    /// <returns>The data returned by the database if found, otherwise returns null.</returns>
    /// <exception cref="System.Data.Common.DbException">Thrown when executing the sql command fails.</exception>
    public static async Task<DbUser?> SelectUserAsync(ulong discordId) {
        var cmdText = "select * from users where discord_id = @discordId";
        await using var connection = await ConnectAsync(_connectionString);
        await using var cmd = new MySqlCommand(cmdText, connection);

        cmd.Parameters.Add("@discordId", DbType.UInt64);
        cmd.Parameters["@discordId"].Value = discordId;

        await using var reader = await cmd.ExecuteReaderAsync();


        if (await reader.ReadAsync())
            return new DbUser(reader.GetUInt64("discord_id"), reader.GetInt32("osu_id"),
                reader.GetString("osu_username"));

        return null;
    }

    /// <summary>
    /// Deletes a row of data corresponding to the discordId in the database's "users" table.
    /// </summary>
    /// <param name="discordId"></param>
    /// <returns>The amount of rows affected.</returns>
    /// <exception cref="System.Data.Common.DbException">Thrown when executing the sql command fails.</exception>
    public static async Task<int> DeleteUserAsync(ulong discordId) {
        var cmdText = "delete from users where discord_id = @discordId";
        await using var connection = await ConnectAsync(_connectionString);
        await using var cmd = new MySqlCommand(cmdText, connection);

        cmd.Parameters.Add("@discordId", DbType.UInt64);
        cmd.Parameters["@discordId"].Value = discordId;

        try {
            return await cmd.ExecuteNonQueryAsync();
        }
        catch (Exception exception) {
            Log.Error("Exception occurred: {ExceptionMessage}", exception.Message);
            return 0;
        }
    }
}