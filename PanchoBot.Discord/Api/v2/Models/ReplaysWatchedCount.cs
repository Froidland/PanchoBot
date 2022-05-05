using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record ReplaysWatchedCount {
    [JsonPropertyName("start_date")] public string StartDate { get; set; }

    [JsonPropertyName("count")] public int Count { get; set; }
}