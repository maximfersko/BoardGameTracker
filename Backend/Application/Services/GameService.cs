using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Exceptions;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Domain.Entities;

namespace Application.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _games;
    private readonly ICollectionRepository _collections;
    private readonly IRatingRepository _ratings;
    private readonly IGameSessionRepository _sessions;
    private readonly ICurrentUserService _currentUser;

    public GameService(
        IGameRepository games,
        ICollectionRepository collections,
        IRatingRepository ratings,
        IGameSessionRepository sessions,
        ICurrentUserService currentUser)
    {
        _games = games;
        _collections = collections;
        _ratings = ratings;
        _sessions = sessions;
        _currentUser = currentUser;
    }

    public async Task<PagedResultDto<GameDto>> GetPagedAsync(string? search, int page, int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (games, totalCount) = await _games.GetPagedAsync(search, page, pageSize);
        var collectionsByGame = await GetCollectionsByGameAsync(games.Select(g => g.Id));
        var averageRatings = await _ratings.GetAverageByGameIdsAsync(games.Select(g => g.Id));

        var items = games
            .Select(g => GameDtoMapper.ToDto(g, averageRatings.GetValueOrDefault(g.Id), collectionsByGame.GetValueOrDefault(g.Id)))
            .ToList();

        return PagedResultDto<GameDto>.From(items, totalCount, page, pageSize);
    }

    public async Task<GameDto?> GetByIdAsync(Guid id)
    {
        var game = await _games.GetByIdAsync(id);
        if (game == null) return null;

        var averageRating = await _ratings.GetAverageByGameIdsAsync(new[] { id });
        var sessionsCount = await _sessions.CountForGameAsync(id);
        var collections = await GetCollectionsByGameAsync(new[] { id });

        var dto = GameDtoMapper.ToDto(game, averageRating.GetValueOrDefault(id), collections.GetValueOrDefault(id));
        dto.SessionsCount = sessionsCount;
        return dto;
    }

    public async Task<Guid> CreateAsync(CreateGameRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Alias))
            throw new ValidationException("Введите алиас игры");

        if (string.IsNullOrWhiteSpace(request.TitleRu))
            throw new ValidationException("Введите название игры на русском");

        if (await _games.GetByAliasAsync(request.Alias) != null)
            throw new ValidationException($"Игра с алиасом '{request.Alias}' уже существует");

        var game = new Game
        {
            Id = Guid.NewGuid(),
            Alias = request.Alias,
            TitleRu = request.TitleRu,
            TitleEn = request.TitleEn,
            ImageUrl = request.ImageUrl ?? "",
            MinPlayers = request.MinPlayers,
            MaxPlayers = request.MaxPlayers,
            MinAge = request.MinAge,
            MinPlayTime = request.MinPlayTime,
            MaxPlayTime = request.MaxPlayTime,
            YearPublished = request.YearPublished
        };

        await _games.AddAsync(game);
        return game.Id;
    }

    private async Task<Dictionary<Guid, List<CollectionSummaryDto>>> GetCollectionsByGameAsync(IEnumerable<Guid> gameIds)
    {
        var result = new Dictionary<Guid, List<CollectionSummaryDto>>();
        if (!_currentUser.UserId.HasValue) return result;

        var ids = gameIds.ToHashSet();
        var userCollections = await _collections.GetForUserAsync(_currentUser.UserId.Value);

        foreach (var collection in userCollections)
        {
            foreach (var item in collection.Items)
            {
                if (!ids.Contains(item.GameId)) continue;

                if (!result.TryGetValue(item.GameId, out var list))
                {
                    list = new List<CollectionSummaryDto>();
                    result[item.GameId] = list;
                }
                list.Add(new CollectionSummaryDto { Id = collection.Id, Name = collection.Name });
            }
        }

        return result;
    }
}
