using System.Threading.Tasks;
using PanchoBot.Api.v2.Models;

namespace PanchoBot.Api.v2;

public interface IOsuClient {
    Task<User?> GetUser(string username, string type);
    Task<Beatmap?> GetBeatmap(ulong beatmapId);
    Task<Score[]?> GetUserScores(int userId, string type, string mode, string includeFails, int limit);
}