using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Exceptions;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using BoardGamesTracker.Domain.Enums;
using Domain.Entities;

namespace Application.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _subscriptions;
    private readonly IUserRepository _users;
    private readonly INotificationRepository _notifications;
    private readonly ICurrentUserService _currentUser;

    public SubscriptionService(
        ISubscriptionRepository subscriptions,
        IUserRepository users,
        INotificationRepository notifications,
        ICurrentUserService currentUser)
    {
        _subscriptions = subscriptions;
        _users = users;
        _notifications = notifications;
        _currentUser = currentUser;
    }

    public async Task<SubscribeResultDto> SubscribeAsync(Guid targetUserId)
    {
        var currentUserId = UserContext.GetCurrentUserId(_currentUser);

        if (targetUserId == currentUserId)
            throw new ValidationException("Нельзя подписаться на самого себя");

        var currentUser = await _users.GetByIdAsync(currentUserId);
        var target = await _users.GetByIdAsync(targetUserId);
        if (target == null)
            throw new ValidationException("Пользователь не найден");

        var existing = await _subscriptions.GetAsync(currentUserId, targetUserId);
        if (existing != null)
            return new SubscribeResultDto
            {
                Subscribed = true,
                Status = existing.Status == SubscriptionStatus.Friend ? "friend" : "following"
            };

        var reverse = await _subscriptions.GetAsync(targetUserId, currentUserId);
        var status = reverse != null ? SubscriptionStatus.Friend : SubscriptionStatus.Subscriber;

        var subscription = new Subscription
        {
            Id = Guid.NewGuid(),
            FollowerId = currentUserId,
            FollowingId = targetUserId,
            Status = status,
            SubscriptionAt = DateTime.UtcNow
        };
        await _subscriptions.AddAsync(subscription);

        if (currentUser != null)
        {
            await _notifications.AddAsync(new Notification
            {
                Id = Guid.NewGuid(),
                UserId = targetUserId,
                Message = $"{currentUser.DisplayName} подписался на вас",
                Type = NotificationType.Subscription,
                Link = $"/profile/{currentUserId}",
                RelatedUserId = currentUserId,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (reverse != null)
        {
            reverse.Status = SubscriptionStatus.Friend;
            await _subscriptions.SaveChangesAsync();
        }

        return new SubscribeResultDto
        {
            Subscribed = true,
            Status = status == SubscriptionStatus.Friend ? "friend" : "following"
        };
    }

    public async Task UnsubscribeAsync(Guid targetUserId)
    {
        var currentUserId = UserContext.GetCurrentUserId(_currentUser);

        var existing = await _subscriptions.GetAsync(currentUserId, targetUserId);
        if (existing == null) return;

        await _subscriptions.RemoveAsync(existing);

        var reverse = await _subscriptions.GetAsync(targetUserId, currentUserId);
        if (reverse != null && reverse.Status == SubscriptionStatus.Friend)
        {
            reverse.Status = SubscriptionStatus.Subscriber;
            await _subscriptions.SaveChangesAsync();
        }
    }

    public async Task<List<UserListItemDto>> GetSubscribersAsync(Guid userId)
    {
        var currentUserId = _currentUser.UserId;
        var users = await _users.GetSubscribersAsync(userId);
        return users.OrderBy(u => u.DisplayName).Select(u => UserDtoMapper.ToListItem(u, currentUserId)).ToList();
    }

    public async Task<List<UserListItemDto>> GetFollowingAsync(Guid userId)
    {
        var currentUserId = _currentUser.UserId;
        var users = await _users.GetFollowingAsync(userId);
        return users.OrderBy(u => u.DisplayName).Select(u => UserDtoMapper.ToListItem(u, currentUserId)).ToList();
    }

    public async Task<List<UserListItemDto>> GetFriendsAsync(Guid userId)
    {
        var currentUserId = _currentUser.UserId;
        var users = await _users.GetFriendsAsync(userId);
        return users.OrderBy(u => u.DisplayName).Select(u => UserDtoMapper.ToListItem(u, currentUserId)).ToList();
    }
}
