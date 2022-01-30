using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record TokenResponse {
    [JsonPropertyName("token_type")]
    public string TokenType { get; init; }
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; init; }
    [JsonPropertyName("access_token")]
    public string AccessToken { get; init; }
}