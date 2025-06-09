using System;
using Domain.Entities;
using Domain.Entities;

namespace Domain.Entities;

public class GameSessionResult
{
    public Guid Id { get; set; }

    public Guid GameSessionId { get; set; }
    public GameSession GameSession { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public int Score { get; set; } 
    public string Notes { get; set; }
}