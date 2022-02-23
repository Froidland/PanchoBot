using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record Weight {
    [JsonPropertyName("percentage")] public float Percentage { get; set; }
    [JsonPropertyName("pp")] public float Pp { get; set; }
}