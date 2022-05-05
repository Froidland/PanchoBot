using System.Globalization;
using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record UserAccountHistory {
    private DateTime _timestamp;

    [JsonPropertyName("description")] public string? Description { get; set; }
    [JsonPropertyName("id")] public int Id { get; set; }
    [JsonPropertyName("length")] public int Length { get; set; }

    [JsonPropertyName("timestamp")]
    public string Timestamp {
        get => _timestamp.ToString(CultureInfo.InvariantCulture);
        set => _timestamp = DateTime.ParseExact(value, "yyyyMMddTHH:mm:ssZ",
            CultureInfo.InvariantCulture);
    }
}