using System;
using System.Threading.Tasks;
using PanchoBot.Api.v2.Models;
using RestSharp;

namespace PanchoBot.Api.v2;

public class OsuClient : IOsuClient {
    private readonly RestClient _client;

    public OsuClient(string clientId, string clientSecret) {
        _client = new RestClient("https://osu.ppy.sh/api/v2/") {
            Authenticator = new OsuAuthenticator("https://osu.ppy.sh/oauth/token", clientId, clientSecret)
        }.AddDefaultHeader(KnownHeaders.Accept, "application/json");
    }

    public async Task<User> GetUser(string userId) {
        var request = new RestRequest($"users/{userId}/osu")
            .AddQueryParameter("key", "username");
        
        return await _client.GetAsync<User>(request);
    }

    public async Task<Beatmap> GetBeatmap(string beatmapId) {
        var request = new RestRequest($"beatmaps/{beatmapId}");

        return await _client.GetAsync<Beatmap>(request);
    }
}