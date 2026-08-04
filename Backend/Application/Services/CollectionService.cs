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

public class CollectionService : ICollectionService
{
    private readonly ICollectionRepository _collections;
    private readonly IGameRepository _games;
    private readonly ICurrentUserService _currentUser;

    public CollectionService(ICollectionRepository collections, IGameRepository games, ICurrentUserService currentUser)
    {
        _collections = collections;
        _games = games;
        _currentUser = currentUser;
    }

    public async Task<List<CollectionDto>> GetForCurrentUserAsync()
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var collections = await _collections.GetForUserAsync(userId);

        var defaultOrder = DefaultCollections.Names.Select((name, index) => (name, index))
            .ToDictionary(x => x.name, x => x.index);

        return collections
            .OrderBy(c => DefaultCollections.IsDefault(c.Name) ? defaultOrder[c.Name] : int.MaxValue)
            .ThenBy(c => c.Name)
            .Select(c => new CollectionDto
            {
                Id = c.Id,
                Name = c.Name,
                GamesCount = c.Items.Count,
                IsDefault = DefaultCollections.IsDefault(c.Name),
                Games = c.Items
                    .Select(i => new CollectionGameDto
                    {
                        Id = i.Game.Id,
                        TitleRu = i.Game.TitleRu,
                        TitleEn = i.Game.TitleEn,
                        YearPublished = i.Game.YearPublished,
                        ImageUrl = i.Game.ImageUrl,
                        AddedAt = i.AddedAt
                    })
                    .ToList()
            })
            .ToList();
    }

    public async Task<Guid> CreateAsync(CreateCollectionRequestDto request)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("Введите название коллекции");

        if (DefaultCollections.IsDefault(request.Name.Trim()))
            throw new ValidationException("Такая коллекция уже существует по умолчанию");

        var collection = new Collection
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            UserId = userId
        };

        await _collections.AddAsync(collection);
        return collection.Id;
    }

    public async Task AddGameAsync(Guid collectionId, Guid gameId)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);
        var collection = await _collections.GetByIdAsync(collectionId)
            ?? throw new NotFoundException("Коллекция не найдена");

        if (collection.UserId != userId)
            throw new NotFoundException("Коллекция не найдена");

        if (await _games.GetByIdAsync(gameId) == null)
            throw new NotFoundException("Игра не найдена");

        if (await _collections.GetItemAsync(collectionId, gameId) != null)
            throw new ValidationException("Игра уже есть в этой коллекции");

        await _collections.AddItemAsync(new CollectionItem
        {
            Id = Guid.NewGuid(),
            CollectionId = collectionId,
            GameId = gameId,
            AddedAt = DateTime.UtcNow
        });
    }

    public async Task RemoveGameAsync(Guid collectionId, Guid gameId)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);
        var collection = await _collections.GetByIdAsync(collectionId)
            ?? throw new NotFoundException("Коллекция не найдена");

        if (collection.UserId != userId)
            throw new NotFoundException("Коллекция не найдена");

        var item = await _collections.GetItemAsync(collectionId, gameId);
        if (item == null) return;

        await _collections.RemoveItemAsync(item);
    }

}
