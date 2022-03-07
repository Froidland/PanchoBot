using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record GradeCounts {
    [JsonPropertyName("ss")] public int Ss { get; set; }

    [JsonPropertyName("ssh")] public int Ssh { get; set; }

    [JsonPropertyName("s")] public int S { get; set; }

    [JsonPropertyName("sh")] public int Sh { get; set; }

    [JsonPropertyName("a")] public int A { get; set; }
}