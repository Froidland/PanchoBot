using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace PanchoBot.Api.v2.Models;

public record User : UserCompact {
    private List<ReplaysWatchedCount> _replaysWatchedCounts;
    private List<string> _profileOrder;
    private List<string> _playstyle;
    private List<UserAccountHistory> _accountHistory;
    private List<Group> _groups;
    private List<MonthlyPlaycount> _monthlyPlaycounts;
    private List<UserAchievement> _userAchievements;

    [JsonPropertyName("default_group")] public string DefaultGroup { get; set; }

    [JsonPropertyName("last_visit")] public DateTime LastVisit { get; set; }

    [JsonPropertyName("pm_friends_only")] public bool PmFriendsOnly { get; set; }

    [JsonPropertyName("cover_url")] public string CoverUrl { get; set; }

    [JsonPropertyName("discord")] public string Discord { get; set; }

    [JsonPropertyName("has_supported")] public bool HasSupported { get; set; }

    [JsonPropertyName("interests")] public object Interests { get; set; }

    [JsonPropertyName("join_date")] public DateTime JoinDate { get; set; }

    [JsonPropertyName("kudosu")] public Kudosu Kudosu { get; set; }

    [JsonPropertyName("location")] public object Location { get; set; }

    [JsonPropertyName("max_blocks")] public int MaxBlocks { get; set; }

    [JsonPropertyName("max_friends")] public int MaxFriends { get; set; }

    [JsonPropertyName("occupation")] public object Occupation { get; set; }

    [JsonPropertyName("playmode")] public string Playmode { get; set; }

    [JsonPropertyName("playstyle")]
    public List<string> Playstyle {
        get => _playstyle;
        set => _playstyle = value;
    }

    [JsonPropertyName("post_count")] public int PostCount { get; set; }

    [JsonPropertyName("profile_order")]
    public List<string> ProfileOrder {
        get => _profileOrder;
        set => _profileOrder = value;
    }

    [JsonPropertyName("title")] public object Title { get; set; }

    [JsonPropertyName("twitter")] public string Twitter { get; set; }

    [JsonPropertyName("website")] public string Website { get; set; }

    [JsonPropertyName("country")] public Country Country { get; set; }

    [JsonPropertyName("cover")] public Cover Cover { get; set; }

    [JsonPropertyName("is_restricted")] public bool IsRestricted { get; set; }

    [JsonPropertyName("account_history")]
    public List<UserAccountHistory> AccountHistory {
        get => _accountHistory;
        set => _accountHistory = value;
    }

    [JsonPropertyName("active_tournament_banner")]
    public object ActiveTournamentBanner { get; set; }

    [JsonPropertyName("badges")] public List<Badge> Badges { get; set; }

    [JsonPropertyName("favourite_beatmapset_count")]
    public int FavouriteBeatmapsetCount { get; set; }

    [JsonPropertyName("follower_count")] public int FollowerCount { get; set; }

    [JsonPropertyName("graveyard_beatmapset_count")]
    public int GraveyardBeatmapsetCount { get; set; }

    [JsonPropertyName("groups")]
    public List<Group> Groups {
        get => _groups;
        set => _groups = value;
    }

    [JsonPropertyName("loved_beatmapset_count")]
    public int LovedBeatmapsetCount { get; set; }

    [JsonPropertyName("monthly_playcounts")]
    public List<MonthlyPlaycount> MonthlyPlaycounts {
        get => _monthlyPlaycounts;
        set => _monthlyPlaycounts = value;
    }

    [JsonPropertyName("page")] public Page Page { get; set; }

    [JsonPropertyName("pending_beatmapset_count")]
    public int PendingBeatmapsetCount { get; set; }

    [JsonPropertyName("previous_usernames")]
    public List<object> PreviousUsernames { get; set; }

    [JsonPropertyName("ranked_beatmapset_count")]
    public int RankedBeatmapsetCount { get; set; }

    [JsonPropertyName("replays_watched_counts")]
    public List<ReplaysWatchedCount> ReplaysWatchedCounts {
        get => _replaysWatchedCounts;
        set => _replaysWatchedCounts = value;
    }

    [JsonPropertyName("scores_first_count")]
    public int ScoresFirstCount { get; set; }

    [JsonPropertyName("statistics")] public Statistics Statistics { get; set; }

    [JsonPropertyName("support_level")] public int SupportLevel { get; set; }

    [JsonPropertyName("user_achievements")]
    public List<UserAchievement> UserAchievements {
        get => _userAchievements;
        set => _userAchievements = value;
    }

    [JsonPropertyName("rank_history")] public RankHistory RankHistory { get; set; }
}