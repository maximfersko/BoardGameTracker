using System;
using System.Collections.Generic;
using Application.Dtos;
using Domain.Entities;

namespace Application.Services;

internal static class GameDtoMapper
{
    public static GameDto ToDto(Game game, double averageRating, List<CollectionSummaryDto>? collections) => new()
    {
        Id = game.Id,
        Alias = game.Alias,
        TitleRu = game.TitleRu,
        TitleEn = game.TitleEn,
        ImageUrl = game.ImageUrl,
        MinPlayers = game.MinPlayers,
        MaxPlayers = game.MaxPlayers,
        MinAge = game.MinAge,
        MinPlayTime = game.MinPlayTime,
        MaxPlayTime = game.MaxPlayTime,
        YearPublished = game.YearPublished,
        AverageRating = averageRating,
        InCollections = collections ?? new List<CollectionSummaryDto>()
    };
}
