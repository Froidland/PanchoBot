#nullable enable
using System;
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record Beatmap : BeatmapCompact {
    [JsonPropertyName("accuracy")] public float Accuracy { get; set; }

    [JsonPropertyName("ar")] public float Ar { get; set; }

    [JsonPropertyName("bpm")] public float? Bpm { get; set; }

    [JsonPropertyName("convert")] public bool Convert { get; set; }

    [JsonPropertyName("count_circles")] public int CountCircles { get; set; }

    [JsonPropertyName("count_sliders")] public int CountSliders { get; set; }

    [JsonPropertyName("count_spinners")] public int CountSpinners { get; set; }

    [JsonPropertyName("cs")] public float Cs { get; set; }

    [JsonPropertyName("deleted_at")] public DateTime? DeletedAt { get; set; }

    [JsonPropertyName("drain")] public float Drain { get; set; }

    [JsonPropertyName("hit_length")] public int HitLength { get; set; }

    [JsonPropertyName("is_scoreable")] public bool IsScoreable { get; set; }

    [JsonPropertyName("last_updated")] public DateTime LastUpdated { get; set; }

    [JsonPropertyName("mode_int")] public int ModeInt { get; set; }

    [JsonPropertyName("passcount")] public int Passcount { get; set; }

    [JsonPropertyName("playcount")] public int Playcount { get; set; }

    [JsonPropertyName("ranked")] public int Ranked { get; set; }

    [JsonPropertyName("url")] public string Url { get; set; }
    
    [JsonPropertyName("beatmapset")] public new Beatmapset? Beatmapset { get; set; }

    [JsonPropertyName("checksum")] public string? Checksum { get; set; }

    [JsonPropertyName("failtimes")] public Failtimes? Failtimes { get; set; }

    [JsonPropertyName("max_combo")] public int? MaxCombo { get; set; }
}