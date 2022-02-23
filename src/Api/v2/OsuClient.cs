#nullable enable
using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
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

    public async Task<User?> GetUser(string username, string type = "username") {
        var request = new RestRequest($"users/{username}/osu")
            .AddQueryParameter("key", type);

        try {
            var response = await _client.GetAsync<User>(request);
            return response;
        }
        catch {
            return null;
        }
    }

    public async Task<Beatmap?> GetBeatmap(string beatmapId) {
        var request = new RestRequest($"beatmaps/{beatmapId}");

        try {
            var response = await _client.GetAsync<Beatmap>(request);
            return response;
        }
        catch {
            return null;
        }
    }

    public async Task<Score[]?> GetUserScores(string userId, string type = "recent", string mode = "osu", string includeFails = "1", int limit = 1) {
        var request = new RestRequest($"users/{userId}/scores/{type}")
            .AddParameter("mode", mode)
            .AddParameter("includeFails", includeFails)
            .AddParameter("limit", limit);
        
        try {
            var response = await _client.GetAsync<Score[]>(request);
            return response;
        }
        catch (Exception e) {
            return null;
        }
    }
}