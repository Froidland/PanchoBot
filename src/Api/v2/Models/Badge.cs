using System;
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record Badge {
    [JsonPropertyName("awarded_at")] public DateTime AwardedAt { get; set; }

    [JsonPropertyName("description")] public string Description { get; set; }

    [JsonPropertyName("image_url")] public string ImageUrl { get; set; }

    [JsonPropertyName("url")] public string Url { get; set; }
}