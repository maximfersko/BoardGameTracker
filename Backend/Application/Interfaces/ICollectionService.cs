using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface ICollectionService
{
    Task<List<CollectionDto>> GetForCurrentUserAsync();
    Task<Guid> CreateAsync(CreateCollectionRequestDto request);
    Task AddGameAsync(Guid collectionId, Guid gameId);
    Task RemoveGameAsync(Guid collectionId, Guid gameId);
}
