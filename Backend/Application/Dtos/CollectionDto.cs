using System.Collections.Generic;

namespace Application.Dtos;

public class CollectionDto : CollectionSummaryDto
{
    public List<CollectionGameDto> Games { get; set; } = new();
}
