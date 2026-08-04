using System;

namespace Application.Dtos;

public class NotificationDto
{
    public Guid Id { get; set; }
    public string Type { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public string Link { get; set; }
    public Guid? RelatedUserId { get; set; }
    public DateTime CreatedAt { get; set; }
}
