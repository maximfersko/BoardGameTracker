using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ICollectionRepository
{
    Task<List<Collection>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Collection?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Collection collection, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<Collection> collections, CancellationToken cancellationToken = default);
    Task<CollectionItem?> GetItemAsync(Guid collectionId, Guid gameId, CancellationToken cancellationToken = default);
    Task AddItemAsync(CollectionItem item, CancellationToken cancellationToken = default);
    Task RemoveItemAsync(CollectionItem item, CancellationToken cancellationToken = default);
}
