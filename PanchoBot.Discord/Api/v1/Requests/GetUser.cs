#nullable enable
using System.Text.Json;
using PanchoBot.Discord.Api.v1.Entities;

namespace PanchoBot.Discord.Api.v1.Requests;

public static class GetUser {
    public static async Task<User?> SendRequest(HttpClient client, string apiKey, string userId) {
        var userResponse = await client.GetAsync($"get_user?k={apiKey}&u={userId}");
        var userContentString = await userResponse.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<User[]>(userContentString);

        return userData?[0];
    }
}