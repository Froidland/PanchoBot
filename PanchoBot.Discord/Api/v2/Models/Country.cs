using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record Country {
    [JsonPropertyName("code")] public string Code { get; set; }

    [JsonPropertyName("name")] public string Name { get; set; }
}