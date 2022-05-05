using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record MonthlyPlaycount {
    [JsonPropertyName("start_date")] public string StartDate { get; set; }

    [JsonPropertyName("count")] public int Count { get; set; }
}