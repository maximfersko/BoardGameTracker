using System;
using BoardGamesTracker.Domain.Enums;

namespace Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; } 
    public User User { get; set; }

    public string Message { get; set; }
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; }
    public string Link { get; set; }
    public Guid? RelatedUserId { get; set; }

    public DateTime CreatedAt { get; set; }
}