using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record Beatmapset : BeatmapsetCompact {
    [JsonPropertyName("favourite_count")] public int FavouriteCount { get; set; }

    [JsonPropertyName("hype")] public object Hype { get; set; }

    [JsonPropertyName("track_id")] public object TrackId { get; set; }

    [JsonPropertyName("availability")] public Availability Availability { get; set; }

    [JsonPropertyName("bpm")] public int Bpm { get; set; }

    [JsonPropertyName("can_be_hyped")] public bool CanBeHyped { get; set; }

    [JsonPropertyName("discussion_enabled")]
    public bool DiscussionEnabled { get; set; }

    [JsonPropertyName("discussion_locked")]
    public bool DiscussionLocked { get; set; }

    [JsonPropertyName("is_scoreable")] public bool IsScoreable { get; set; }

    [JsonPropertyName("last_updated")] public DateTime LastUpdated { get; set; }

    [JsonPropertyName("legacy_thread_url")]
    public string LegacyThreadUrl { get; set; }

    [JsonPropertyName("nominations_summary")]
    public NominationsSummary NominationsSummary { get; set; }

    [JsonPropertyName("ranked")] public int Ranked { get; set; }

    [JsonPropertyName("ranked_date")] public DateTime RankedDate { get; set; }

    [JsonPropertyName("storyboard")] public bool Storyboard { get; set; }

    [JsonPropertyName("submitted_date")] public DateTime SubmittedDate { get; set; }

    [JsonPropertyName("tags")] public string Tags { get; set; }

    [JsonPropertyName("ratings")] public List<int> Ratings { get; set; }
}