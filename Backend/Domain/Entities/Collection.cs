using System;
using System.Collections.Generic;
using Domain.Entities;

namespace Domain.Entities;

public class Collection
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }

    public ICollection<CollectionItem> Items { get; set; }
}