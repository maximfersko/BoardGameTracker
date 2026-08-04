using System;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface INotificationService
{
    Task<PagedResultDto<NotificationDto>> GetForCurrentUserAsync(int page, int pageSize);
    Task<bool> MarkAsReadAsync(Guid id);
}
