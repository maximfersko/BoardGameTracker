using System;

namespace Domain.Entities;

public class GuestPlayer
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string Name { get; set; }
    public int GamesCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
