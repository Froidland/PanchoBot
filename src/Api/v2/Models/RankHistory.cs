using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record RankHistory {
    [JsonPropertyName("mode")] public string Mode { get; set; }

    [JsonPropertyName("data")] public List<int> Data { get; set; }
}