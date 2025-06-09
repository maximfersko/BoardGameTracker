using System;
using System.Collections.Generic;
using Domain.Entities;

namespace Domain.Entities;

public class Game
{
    public Guid Id { get; set; }
    public string Alias { get; set; }
    
    public string TitleRu { get; set; }
    public string TitleEn { get; set; }
    public string ImageUrl { get; set; }

    public int MinPlayers { get; set; }
    public int MaxPlayers { get; set; }
    public int MinAge { get; set; }
    public int MinPlayTime { get; set; }
    public int MaxPlayTime { get; set; }
    public int YearPublished { get; set; }

    public ICollection<CollectionItem> CollectionItems { get; set; }
    public ICollection<GameSession> GameSessions { get; set; }
    
}