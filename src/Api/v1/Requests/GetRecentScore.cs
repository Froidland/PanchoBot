#nullable enable
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using PanchoBot.Api.v1.Entities;

namespace PanchoBot.Api.v1.Requests;

public static class GetRecentScore {
    public static async Task<UserRecentScore?> SendRequest(HttpClient client, string apiKey, string userId) {
        var userScoreResponse = await client.GetAsync($"get_user_recent?k={apiKey}&u={userId}&limit=1");
        var userScoreContentString = await userScoreResponse.Content.ReadAsStringAsync();
        var userScoreData = JsonSerializer.Deserialize<UserRecentScore[]>(userScoreContentString);
        
        return userScoreData?.Length == 0 ? null : userScoreData?[0];
    }
}