using System;

namespace Application.Dtos;

public class GuestPlayerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int GamesCount { get; set; }
}
