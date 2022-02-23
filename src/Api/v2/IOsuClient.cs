using System.Threading.Tasks;
using PanchoBot.Api.v2.Models;
using RestSharp;

namespace PanchoBot.Api.v2; 

public interface IOsuClient {
    Task<User> GetUser(string username, string type);
    Task<Beatmap> GetBeatmap(string beatmapId);
    Task<Score[]> GetUserScores(string userId, string type, string mode, string includeFails, int limit);
}