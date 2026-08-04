using System;
using System.Collections.Generic;

namespace Application.Dtos;

public class SessionDto
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public string Game { get; set; }
    public DateTime PlayedAt { get; set; }
    public int PlayersCount { get; set; }
    public List<SessionPlayerDto> Players { get; set; } = new();
}
