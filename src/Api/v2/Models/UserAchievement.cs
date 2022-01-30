using System;
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models; 

public record UserAchievement {
    [JsonPropertyName("achieved_at")] public DateTime AchievedAt { get; set; }

    [JsonPropertyName("achievement_id")] public int AchievementId { get; set; }
}