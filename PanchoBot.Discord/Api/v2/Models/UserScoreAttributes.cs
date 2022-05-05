using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record UserScoreAttributes {
    [JsonPropertyName("pin")] public bool? Pin { get; set; }
}