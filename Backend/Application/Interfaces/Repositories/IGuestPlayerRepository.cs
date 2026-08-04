using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IGuestPlayerRepository
{
    Task<List<GuestPlayer>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<GuestPlayer?> GetByNameAsync(Guid userId, string name, CancellationToken cancellationToken = default);
    Task AddAsync(GuestPlayer guestPlayer, CancellationToken cancellationToken = default);
    Task RemoveAsync(GuestPlayer guestPlayer, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
