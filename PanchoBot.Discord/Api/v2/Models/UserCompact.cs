using System.Text.Json.Serialization;

namespace PanchoBot.Discord.Api.v2.Models;

public record UserCompact {
    [JsonPropertyName("id")] public int Id { get; set; }

    [JsonPropertyName("username")] public string Username { get; set; }

    [JsonPropertyName("profile_colour")] public string ProfileColour { get; set; }

    [JsonPropertyName("avatar_url")] public string AvatarUrl { get; set; }

    [JsonPropertyName("country_code")] public string CountryCode { get; set; }

    [JsonPropertyName("is_active")] public bool IsActive { get; set; }

    [JsonPropertyName("is_bot")] public bool IsBot { get; set; }

    [JsonPropertyName("is_deleted")] public bool IsDeleted { get; set; }

    [JsonPropertyName("is_online")] public bool IsOnline { get; set; }

    [JsonPropertyName("is_supporter")] public bool IsSupporter { get; set; }
}