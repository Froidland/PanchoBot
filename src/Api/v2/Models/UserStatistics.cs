using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record Statistics {
    [JsonPropertyName("level")] public Level Level { get; set; }

    [JsonPropertyName("pp")] public double Pp { get; set; }

    [JsonPropertyName("global_rank")] public int GlobalRank { get; set; }

    [JsonPropertyName("ranked_score")] public ulong RankedScore { get; set; }

    [JsonPropertyName("hit_accuracy")] public double HitAccuracy { get; set; }

    [JsonPropertyName("play_count")] public int PlayCount { get; set; }

    [JsonPropertyName("play_time")] public int PlayTime { get; set; }

    [JsonPropertyName("total_score")] public ulong TotalScore { get; set; }

    [JsonPropertyName("total_hits")] public int TotalHits { get; set; }

    [JsonPropertyName("maximum_combo")] public int MaximumCombo { get; set; }

    [JsonPropertyName("replays_watched_by_others")]
    public int ReplaysWatchedByOthers { get; set; }

    [JsonPropertyName("is_ranked")] public bool IsRanked { get; set; }

    [JsonPropertyName("grade_counts")] public GradeCounts GradeCounts { get; set; }

    [JsonPropertyName("rank")] public Rank Rank { get; set; }
}