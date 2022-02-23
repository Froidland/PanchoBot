using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record UserScoreAttributes {
    [JsonPropertyName("pin")] public bool? Pin { get; set; }
}