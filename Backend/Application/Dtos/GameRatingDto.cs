using System;

namespace Application.Dtos;

public class GameRatingDto
{
    public Guid GameId { get; set; }
    public int Value { get; set; }
}
