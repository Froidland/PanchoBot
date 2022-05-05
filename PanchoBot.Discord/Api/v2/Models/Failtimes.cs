using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record Failtimes {
    [JsonPropertyName("fail")] public List<int> Fail { get; set; }

    [JsonPropertyName("exit")] public List<int> Exit { get; set; }
}