using System.Threading.Tasks;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using PanchoBot.Database;

namespace PanchoBot.Commands;

public class DatabaseModule : BaseCommandModule {
    [RequireOwner]
    [Command("insertuser")]
    public async Task InsertUser(CommandContext ctx, ulong discordId, int osuId, [RemainingText] string osuUsername) {
        var rowsAffected = await DatabaseHandler.InsertUserAsync(discordId, osuId, osuUsername);

        await ctx.RespondAsync($"{rowsAffected} row(s) affected.");
    }

    [RequireOwner]
    [Command("updateuser")]
    public async Task UpdateUser(CommandContext ctx, ulong discordId, int osuId, [RemainingText] string osuUsername) {
        var rowsAffected = await DatabaseHandler.UpdateUserAsync(discordId, osuId, osuUsername);

        await ctx.RespondAsync($"{rowsAffected} row(s) affected.");
    }

    [RequireOwner]
    [Command("selectuser")]
    public async Task SelectUser(CommandContext ctx, ulong discordId) {
        var user = await DatabaseHandler.SelectUserAsync(discordId);

        if (user is null) {
            await ctx.RespondAsync("No rows returned.");
            return;
        }

        await ctx.RespondAsync($"Discord ID: {user.DiscordId} \nosu! ID: {user.OsuId} \nUsername: {user.OsuUsername}");
    }

    [RequireOwner]
    [Command("deleteuser")]
    public async Task DeleteUser(CommandContext ctx, ulong discordId) {
        var rowsAffected = await DatabaseHandler.DeleteUserAsync(discordId);

        await ctx.RespondAsync($"{rowsAffected} row(s) affected.");
    }
}
