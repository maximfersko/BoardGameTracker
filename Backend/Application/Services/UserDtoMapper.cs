using System;
using System.Linq;
using Application.Dtos;
using BoardGamesTracker.Domain.Enums;
using Domain.Entities;

namespace Application.Services;

internal static class UserDtoMapper
{
    public static UserListItemDto ToListItem(User user, Guid? currentUserId) => new()
    {
        Id = user.Id,
        DisplayName = user.DisplayName,
        Email = user.Email,
        RegisteredAt = user.RegisteredAt,
        GamesCount = user.Collections.Sum(c => c.Items.Count),
        SessionsCount = user.GameSessions.Count,
        FollowersCount = user.Followers.Count,
        FollowingCount = user.Following.Count,
        SubscriptionStatus = GetSubscriptionStatus(user, currentUserId)
    };

    public static string GetSubscriptionStatus(User user, Guid? currentUserId)
    {
        if (!currentUserId.HasValue) return "none";

        var subscription = user.Followers.FirstOrDefault(f => f.FollowerId == currentUserId.Value);
        if (subscription == null) return "none";

        return subscription.Status == SubscriptionStatus.Friend ? "friend" : "following";
    }
}
