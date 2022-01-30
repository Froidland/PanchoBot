#nullable enable
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using PanchoBot.Api.v1.Entities;

namespace PanchoBot.Api.v1.Requests; 

public static class GetBeatmap {
    public static async Task<Beatmap?> SendRequest(HttpClient client, string apiKey, string beatmapId) {
        var beatmapResponse = await client.GetAsync($"get_beatmaps?k={apiKey}&b={beatmapId}");
        var beatmapContentString = await beatmapResponse.Content.ReadAsStringAsync();
        var beatmapData = JsonSerializer.Deserialize<Beatmap[]>(beatmapContentString);

        return beatmapData?.Length == 0 ? null : beatmapData?[0];
    }
}