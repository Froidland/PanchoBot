using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record Group {
    [JsonPropertyName("id")] public int Id { get; set; }

    [JsonPropertyName("identifier")] public string Identifier { get; set; }

    [JsonPropertyName("name")] public string Name { get; set; }

    [JsonPropertyName("short_name")] public string ShortName { get; set; }

    [JsonPropertyName("description")] public string Description { get; set; }

    [JsonPropertyName("colour")] public string Colour { get; set; }
}