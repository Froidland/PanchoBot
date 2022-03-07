namespace PanchoBot.Database.Models;

public record DbUser(ulong DiscordId, int OsuId, string OsuUsername) {
    public ulong DiscordId { get; set; } = DiscordId;
    public int OsuId { get; set; } = OsuId;
    public string OsuUsername { get; set; } = OsuUsername;
}