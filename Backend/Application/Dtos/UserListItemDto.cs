using System;

namespace Application.Dtos;

public class UserListItemDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public DateTime RegisteredAt { get; set; }
    public int GamesCount { get; set; }
    public int SessionsCount { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public string SubscriptionStatus { get; set; }
}
