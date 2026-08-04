using System;

namespace Application.Dtos;

public class CollectionSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int GamesCount { get; set; }
    public bool IsDefault { get; set; }
}
