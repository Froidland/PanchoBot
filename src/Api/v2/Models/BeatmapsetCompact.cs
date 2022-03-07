using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record BeatmapsetCompact {
    [JsonPropertyName("artist")] public string Artist { get; set; }
    [JsonPropertyName("artist_unicode")] public string ArtistUnicode { get; set; }
    [JsonPropertyName("covers")] public Covers Covers { get; set; }
    [JsonPropertyName("creator")] public string Creator { get; set; }
    [JsonPropertyName("favorite_count")] public int FavouriteCount { get; set; }
    [JsonPropertyName("id")] public int Id { get; set; }
    [JsonPropertyName("nsfw")] public bool Nsfw { get; set; }
    [JsonPropertyName("play_count")] public int PlayCount { get; set; }
    [JsonPropertyName("preview_url")] public string PreviewUrl { get; set; }
    [JsonPropertyName("source")] public string Source { get; set; }
    [JsonPropertyName("status")] public string Status { get; set; }
    [JsonPropertyName("title")] public string Title { get; set; }
    [JsonPropertyName("title_unicode")] public string TitleUnicode { get; set; }
    [JsonPropertyName("user_id")] public int UserId { get; set; }
    [JsonPropertyName("video")] public bool Video { get; set; }
    [JsonPropertyName("beatmaps")] public Beatmap[] Beatmaps { get; set; }
}