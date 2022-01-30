using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record Availability {
    [JsonPropertyName("download_disabled")]
    public bool DownloadDisabled { get; set; }

    [JsonPropertyName("more_information")] public object MoreInformation { get; set; }
}