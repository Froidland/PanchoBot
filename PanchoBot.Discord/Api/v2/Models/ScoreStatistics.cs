using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record ScoreStatistics {
    [JsonPropertyName("count_50")] public int Count50 { get; set; }
    [JsonPropertyName("count_100")] public int Count100 { get; set; }
    [JsonPropertyName("count_300")] public int Count300 { get; set; }
    [JsonPropertyName("count_geki")] public int CountGeki { get; set; }
    [JsonPropertyName("count_katu")] public int CountKatu { get; set; }
    [JsonPropertyName("count_miss")] public int CountMiss { get; set; }
}