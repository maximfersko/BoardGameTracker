using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IRatingRepository
{
    Task<Rating?> GetAsync(Guid gameId, Guid userId, CancellationToken cancellationToken = default);
    Task<Dictionary<Guid, double>> GetAverageByGameIdsAsync(IEnumerable<Guid> gameIds, CancellationToken cancellationToken = default);
    Task AddAsync(Rating rating, CancellationToken cancellationToken = default);
    Task UpdateAsync(Rating rating, CancellationToken cancellationToken = default);
    Task RemoveAsync(Rating rating, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
