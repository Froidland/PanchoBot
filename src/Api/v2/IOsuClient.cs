using System.Threading.Tasks;
using PanchoBot.Api.v2.Models;

namespace PanchoBot.Api.v2; 

public interface IOsuClient {
    Task<User> GetUser(string userId);
    Task<Beatmap> GetBeatmap(string beatmapId);
}