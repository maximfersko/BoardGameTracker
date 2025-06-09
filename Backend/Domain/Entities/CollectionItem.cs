using System;
using Domain.Entities;

namespace Domain.Entities;

public class CollectionItem
{
    public Guid Id { get; set; }

    public Guid CollectionId { get; set; }
    public Collection Collection { get; set; }

    public Guid GameId { get; set; }
    public Game Game { get; set; }

    public DateTime AddedAt { get; set; }
}