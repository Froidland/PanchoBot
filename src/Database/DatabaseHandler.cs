using System;
using System.Data.Common;
using System.Threading.Tasks;
using MySqlConnector;
using PanchoBot.Database.Models;

namespace PanchoBot.Database;

public static class DatabaseHandler {
    private static MySqlConnection? _connection;

    public static async Task Connect(string Ip, string username, string password, string database) {
        var connectionString = $"Server={Ip};User ID={username};Password={password};Database={database}";
        var connection = new MySqlConnection(connectionString);
        
        try {
            Console.WriteLine("Establishing connection with the database.");
            await connection.OpenAsync();
            Console.WriteLine("Database connection successful.");
        }
        catch (MySqlException e) {
            Console.WriteLine(e.Message);
        }

        _connection = connection;
    }
    
    #region linkedUsersDB
    public static async Task<Exception?> AddUser(ulong discordId, int osuId, string osuUsername) {
        await using var cmd = new MySqlCommand(
            $"insert into users (discord_id, osu_id, osu_username) values ({discordId}, {osuId}, '{osuUsername}')",
            _connection);

        try {
            await cmd.ExecuteNonQueryAsync();
            return null;
        }
        catch (DbException e) {
            return e;
        }
    }

    public static async Task<Exception?> UpdateUser(ulong discordId, int osuId, string osuUsername) {
        await using var cmd = new MySqlCommand($"update users set osu_id = {osuId}, osu_username = '{osuUsername}' where discord_id = {discordId}", _connection);

        try {
            await cmd.ExecuteNonQueryAsync();
            return null;
        }
        catch (Exception e) {
            return e;
        }
    }

    public static async Task<DbUser?> GetUser(ulong discordId) {
        await using var cmd = new MySqlCommand($"select * from users where discord_id = {discordId}", _connection);
        var reader = await cmd.ExecuteReaderAsync();

        try {
            reader.Read();
            var entry = new DbUser(reader.GetUInt64("discord_id"), reader.GetInt32("osu_id"), reader.GetString("osu_username"));
            return entry;
        }
        catch (Exception e) {
            Console.WriteLine(e.Message);
            return null;
        }
        finally {
            await reader.DisposeAsync();
        }
    }
    #endregion
}