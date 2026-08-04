using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class RatingRepository : RepositoryBase, IRatingRepository
{
    public RatingRepository(ApplicationDbContext db) : base(db) { }

    public async Task<Rating?> GetAsync(Guid gameId, Guid userId, CancellationToken cancellationToken = default) =>
        await Db.Ratings.FirstOrDefaultAsync(r => r.GameId == gameId && r.UserId == userId, cancellationToken);

    public async Task<Dictionary<Guid, double>> GetAverageByGameIdsAsync(IEnumerable<Guid> gameIds, CancellationToken cancellationToken = default)
    {
        var ids = gameIds.ToHashSet();
        if (ids.Count == 0) return new Dictionary<Guid, double>();

        return await Db.Ratings
            .Where(r => ids.Contains(r.GameId))
            .GroupBy(r => r.GameId)
            .Select(g => new { GameId = g.Key, Average = g.Average(r => r.Value) })
            .ToDictionaryAsync(x => x.GameId, x => x.Average, cancellationToken);
    }

    public async Task AddAsync(Rating rating, CancellationToken cancellationToken = default)
    {
        await Db.Ratings.AddAsync(rating, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public Task UpdateAsync(Rating rating, CancellationToken cancellationToken = default)
    {
        Db.Ratings.Update(rating);
        return SaveChangesAsync(cancellationToken);
    }

    public Task RemoveAsync(Rating rating, CancellationToken cancellationToken = default)
    {
        Db.Ratings.Remove(rating);
        return SaveChangesAsync(cancellationToken);
    }
}
