#nullable enable
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record BeatmapCompact {
    [JsonPropertyName("beatmapset_id")] public int BeatmapsetId { get; set; }

    [JsonPropertyName("difficulty_rating")]
    public float DifficultyRating { get; set; }

    [JsonPropertyName("id")] public int Id { get; set; }

    [JsonPropertyName("mode")] public string Mode { get; set; }

    [JsonPropertyName("status")] public string Status { get; set; }

    [JsonPropertyName("total_length")] public int TotalLength { get; set; }

    [JsonPropertyName("user_id")] public int UserId { get; set; }

    [JsonPropertyName("version")] public string Version { get; set; }

    [JsonPropertyName("beatmapset")] public BeatmapsetCompact? Beatmapset { get; set; }
    
    [JsonPropertyName("checksum")] public string? Checksum { get; set; }

    [JsonPropertyName("failtimes")] public Failtimes? Failtimes { get; set; }

    [JsonPropertyName("max_combo")] public int? MaxCombo { get; set; }
}