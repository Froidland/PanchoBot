using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record Page {
    [JsonPropertyName("html")] public string Html { get; set; }

    [JsonPropertyName("raw")] public string Raw { get; set; }
}