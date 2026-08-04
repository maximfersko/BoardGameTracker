using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using BoardGamesTracker.Domain.Enums;
using Domain.Entities;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;
    private readonly ICurrentUserService _currentUser;

    public UserService(IUserRepository users, ICurrentUserService currentUser)
    {
        _users = users;
        _currentUser = currentUser;
    }

    public async Task<PagedResultDto<UserListItemDto>> GetPagedAsync(string? search, int page, int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (users, totalCount) = await _users.GetPagedWithCountsAsync(search, page, pageSize);
        var currentUserId = _currentUser.UserId;

        var items = users
            .Select(u => UserDtoMapper.ToListItem(u, currentUserId))
            .ToList();

        return PagedResultDto<UserListItemDto>.From(items, totalCount, page, pageSize);
    }

    public async Task<UserDetailDto?> GetByIdAsync(Guid id)
    {
        var user = await _users.GetByIdWithDetailsAsync(id);
        if (user == null) return null;

        return new UserDetailDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            RegisteredAt = user.RegisteredAt,
            GamesCount = user.Collections.Sum(c => c.Items.Count),
            SessionsCount = user.GameSessions.Count,
            FollowersCount = user.Followers.Count,
            FollowingCount = user.Following.Count,
            FriendsCount = user.Followers.Count(f => f.Status == SubscriptionStatus.Friend),
            SubscriptionStatus = UserDtoMapper.GetSubscriptionStatus(user, _currentUser.UserId),
            Collections = user.Collections
                .Select(c => new CollectionSummaryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    GamesCount = c.Items.Count,
                    IsDefault = DefaultCollections.IsDefault(c.Name)
                })
                .ToList()
        };
    }
}
