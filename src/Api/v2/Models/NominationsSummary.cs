using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record NominationsSummary {
    [JsonPropertyName("current")] public int Current { get; set; }

    [JsonPropertyName("required")] public int Required { get; set; }
}