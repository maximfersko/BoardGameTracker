using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.Interfaces.Repositories;

namespace Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notifications;
    private readonly ICurrentUserService _currentUser;

    public NotificationService(INotificationRepository notifications, ICurrentUserService currentUser)
    {
        _notifications = notifications;
        _currentUser = currentUser;
    }

    public async Task<PagedResultDto<NotificationDto>> GetForCurrentUserAsync(int page, int pageSize)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (notifications, totalCount) = await _notifications.GetPagedForUserAsync(userId, page, pageSize);

        var items = notifications
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Type = n.Type.ToString(),
                Message = n.Message,
                IsRead = n.IsRead,
                Link = n.Link,
                RelatedUserId = n.RelatedUserId,
                CreatedAt = n.CreatedAt
            })
            .ToList();

        return PagedResultDto<NotificationDto>.From(items, totalCount, page, pageSize);
    }

    public async Task<bool> MarkAsReadAsync(Guid id)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var notification = await _notifications.GetByIdForUserAsync(id, userId);
        if (notification == null) return false;

        notification.IsRead = true;
        await _notifications.SaveChangesAsync();
        return true;
    }
}
