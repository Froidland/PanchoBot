using System;

namespace PanchoBot.Api.v2.Models; 

public record Score {
    public long Id { get; set; }
    public long BestId { get; set; }
    public long UserId { get; set; }
    public double Accuracy { get; set; }
    public long ScoreScore { get; set; }
    public string Username { get; set; }
    public long Maxcombo { get; set; }
    public long Count50 { get; set; }
    public long Count100 { get; set; }
    public long Count300 { get; set; }
    public long Countmiss { get; set; }
    public long Countkatu { get; set; }
    public long Countgeki { get; set; }
    public long Perfect { get; set; }
    public long EnabledMods { get; set; }
    public DateTimeOffset Date { get; set; }
    public string Rank { get; set; }
    public string Pp { get; set; }
    public long ReplayAvailable { get; set; }
}