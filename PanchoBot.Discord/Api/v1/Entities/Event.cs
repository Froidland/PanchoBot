using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v1.Entities;

public class Event {
    [JsonPropertyName("display_html")] public string DisplayHtml { get; set; }

    [JsonPropertyName("beatmap_id")] public string BeatmapId { get; set; }

    [JsonPropertyName("beatmapset_id")] public string BeatmapsetId { get; set; }

    [JsonPropertyName("date")] public string Date { get; set; }

    [JsonPropertyName("epicfactor")] public string Epicfactor { get; set; }
}