using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class CollectionRepository : RepositoryBase, ICollectionRepository
{
    public CollectionRepository(ApplicationDbContext db) : base(db) { }

    public async Task<List<Collection>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await Db.Collections
            .Where(c => c.UserId == userId)
            .Include(c => c.Items)
                .ThenInclude(i => i.Game)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<Collection?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await Db.Collections.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

    public async Task AddAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        await Db.Collections.AddAsync(collection, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<Collection> collections, CancellationToken cancellationToken = default)
    {
        await Db.Collections.AddRangeAsync(collections, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task<CollectionItem?> GetItemAsync(Guid collectionId, Guid gameId, CancellationToken cancellationToken = default) =>
        await Db.CollectionItems.FirstOrDefaultAsync(i => i.CollectionId == collectionId && i.GameId == gameId, cancellationToken);

    public async Task AddItemAsync(CollectionItem item, CancellationToken cancellationToken = default)
    {
        await Db.CollectionItems.AddAsync(item, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveItemAsync(CollectionItem item, CancellationToken cancellationToken = default)
    {
        Db.CollectionItems.Remove(item);
        await SaveChangesAsync(cancellationToken);
    }
}
