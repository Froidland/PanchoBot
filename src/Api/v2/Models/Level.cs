using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record Level {
    [JsonPropertyName("current")] public int Current { get; set; }

    [JsonPropertyName("progress")] public int Progress { get; set; }
}