using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface ISubscriptionService
{
    Task<SubscribeResultDto> SubscribeAsync(Guid targetUserId);
    Task UnsubscribeAsync(Guid targetUserId);
    Task<List<UserListItemDto>> GetSubscribersAsync(Guid userId);
    Task<List<UserListItemDto>> GetFollowingAsync(Guid userId);
    Task<List<UserListItemDto>> GetFriendsAsync(Guid userId);
}
