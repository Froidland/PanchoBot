using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record Covers {
    [JsonPropertyName("cover")] public string Cover { get; set; }
    [JsonPropertyName("cover@2x")] public string Cover2X { get; set; }
    [JsonPropertyName("card")] public string Card { get; set; }
    [JsonPropertyName("card@2x")] public string Card2X { get; set; }
    [JsonPropertyName("list")] public string List { get; set; }
    [JsonPropertyName("list@2x")] public string List2X { get; set; }
    [JsonPropertyName("slimcover")] public string SlimCover { get; set; }
    [JsonPropertyName("slimcover@2x")] public string SlimCover2X { get; set; }
}