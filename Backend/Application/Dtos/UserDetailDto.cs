using System.Collections.Generic;

namespace Application.Dtos;

public class UserDetailDto : UserListItemDto
{
    public int FriendsCount { get; set; }
    public List<CollectionSummaryDto> Collections { get; set; } = new();
}
