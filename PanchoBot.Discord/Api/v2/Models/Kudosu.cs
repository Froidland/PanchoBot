using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record Kudosu {
    [JsonPropertyName("total")] public int Total { get; set; }

    [JsonPropertyName("available")] public int Available { get; set; }
}