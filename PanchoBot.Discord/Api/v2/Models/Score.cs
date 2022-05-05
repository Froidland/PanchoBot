using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record Score {
    [JsonPropertyName("id")] public long Id { get; set; }
    [JsonPropertyName("user_id")] public long UserId { get; set; }
    [JsonPropertyName("accuracy")] public double Accuracy { get; set; }
    [JsonPropertyName("mods")] public string?[] Mods { get; set; }
    [JsonPropertyName("score")] public int ScoreCount { get; set; }
    [JsonPropertyName("max_combo")] public int MaxCombo { get; set; }
    [JsonPropertyName("perfect")] public bool Perfect { get; set; }
    [JsonPropertyName("statistics")] public ScoreStatistics? Statistics { get; set; }
    [JsonPropertyName("rank")] public string? Rank { get; set; }
    [JsonPropertyName("created_at")] public string CreatedAt { get; set; }
    [JsonPropertyName("best_id")] public ulong? BestId { get; set; }
    [JsonPropertyName("pp")] public float? Pp { get; set; }
    [JsonPropertyName("mode")] public string? Mode { get; set; }
    [JsonPropertyName("mode_int")] public int ModeInt { get; set; }
    [JsonPropertyName("replay")] public bool Replay { get; set; }

    [JsonPropertyName("current_user_attributes")]
    public UserScoreAttributes? Attributes { get; set; }

    [JsonPropertyName("beatmap")] public Beatmap? Beatmap { get; set; }
    [JsonPropertyName("beatmapset")] public Beatmapset? Beatmapset { get; set; }
    [JsonPropertyName("user")] public User? User { get; set; }
}