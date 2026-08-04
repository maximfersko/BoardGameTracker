using System;

namespace Application.Dtos;

public class CollectionGameDto
{
    public Guid Id { get; set; }
    public string TitleRu { get; set; }
    public string TitleEn { get; set; }
    public int YearPublished { get; set; }
    public string ImageUrl { get; set; }
    public DateTime AddedAt { get; set; }
}
