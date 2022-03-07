using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record Cover {
    [JsonPropertyName("custom_url")] public string CustomUrl { get; set; }

    [JsonPropertyName("url")] public string Url { get; set; }

    [JsonPropertyName("id")] public object Id { get; set; }
}