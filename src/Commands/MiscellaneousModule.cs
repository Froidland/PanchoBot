using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using PanchoBot.Database;

namespace PanchoBot.Commands;

public class MiscellaneousModule : BaseCommandModule {
    [Command("check")]
    [RequireUserPermissions(Permissions.Administrator)]
    public async Task CheckUser(CommandContext ctx, ulong discordId) {
        var entry = await DatabaseHandler.GetUser(discordId);

        if (entry is null)
            await ctx.Message.RespondAsync($"Discord id `{discordId}` is not linked to any osu! account.");
        else
            await ctx.Message.RespondAsync($"Discord id `{discordId}` is linked to osu! account `{entry.OsuUsername}`");
    }
}