namespace PanchoBot.Database.Models;

public class DbUser {
    public DbUser(ulong discordId, int osuId, string osuUsername) {
        DiscordId = discordId;
        OsuId = osuId;
        OsuUsername = osuUsername;
    }

    public ulong DiscordId { get; }
    public int OsuId { get; }

    public string OsuUsername { get; }
}
