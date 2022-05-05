using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record Rank {
    [JsonPropertyName("global")] public int Global { get; set; }

    [JsonPropertyName("country")] public int Country { get; set; }
}