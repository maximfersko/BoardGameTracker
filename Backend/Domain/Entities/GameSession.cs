using System;
using System.Collections.Generic;
using Domain.Entities;

namespace Domain.Entities;

public class GameSession
{
    public Guid Id { get; set; }

    public Guid GameId { get; set; }
    public Game Game { get; set; }

    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; }

    public DateTime PlayedAt { get; set; }

    public ICollection<GameSessionResult> Results { get; set; }
}