#nullable enable
using System;
using System.Text.Json;
using System.Threading.Tasks;
using PanchoBot.Api.v2.Models;
using RestSharp;
using Serilog;

namespace PanchoBot.Api.v2;

public class OsuClient : IOsuClient {
    private readonly RestClient _client;

    public OsuClient(string clientId, string clientSecret) {
        _client = new RestClient("https://osu.ppy.sh/api/v2/") {
            Authenticator = new OsuAuthenticator("https://osu.ppy.sh/oauth/token", clientId, clientSecret)
        }.AddDefaultHeader(KnownHeaders.Accept, "application/json");
    }

    public async Task<User?> GetUser(string username, string type = "username") {
        var endpoint = $"users/{username}/osu";
        RestResponse response;

        var request = new RestRequest(endpoint)
            .AddQueryParameter("key", type);
        Log.Debug("[osu!API] Sending request to {Endpoint}", endpoint);

        try {
            response = await _client.GetAsync(request);
        }
        catch (Exception exception) {
            Log.Error(exception, "[osu!API] There was an error while sending a request to {Endpoint}", endpoint);
            return null;
        }

        if (!response.IsSuccessful) {
            return null;
        }

        Log.Debug("[osu!API] Request sent to {Endpoint} was successful", endpoint);
        return JsonSerializer.Deserialize<User>(response.Content!);
    }

    public async Task<Beatmap?> GetBeatmap(ulong beatmapId) {
        var endpoint = $"beatmaps/{beatmapId}";
        RestResponse response;

        var request = new RestRequest(endpoint);
        Log.Debug("[osu!API] Sending request to {Endpoint}", endpoint);

        try {
            response = await _client.GetAsync(request);
        }
        catch (Exception exception) {
            Log.Error(exception, "[osu!API] There was an error while sending a request to {Endpoint}", endpoint);
            return null;
        }

        if (!response.IsSuccessful) {
            return null;
        }

        Log.Debug("[osu!API] Request sent to {Endpoint} was successful", endpoint);
        return JsonSerializer.Deserialize<Beatmap>(response.Content!);
    }

    public async Task<Score[]?> GetUserScores(int userId, string type, string mode = "osu", string includeFails = "1",
        int limit = 1) {
        var endpoint = $"users/{userId}/scores/{type}";
        RestResponse response;

        var request = new RestRequest(endpoint)
            .AddParameter("mode", mode)
            .AddParameter("includeFails", includeFails)
            .AddParameter("limit", limit);
        Log.Debug("[osu!API] Sending request to {Endpoint}", endpoint);

        try {
            response = await _client.GetAsync(request);
        }
        catch (Exception exception) {
            Log.Error(exception, "[osu!API] There was an error while sending a request to {Endpoint}", endpoint);
            return null;
        }

        if (!response.IsSuccessful) {
            return null;
        }

        Log.Debug("[osu!API] Request sent to {Endpoint} was successful", endpoint);
        return JsonSerializer.Deserialize<Score[]>(response.Content!);
    }
}
