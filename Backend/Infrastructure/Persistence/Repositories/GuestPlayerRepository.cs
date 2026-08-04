using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class GuestPlayerRepository : RepositoryBase, IGuestPlayerRepository
{
    public GuestPlayerRepository(ApplicationDbContext db) : base(db) { }

    public async Task<List<GuestPlayer>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await Db.GuestPlayers
            .Where(g => g.UserId == userId)
            .OrderByDescending(g => g.GamesCount)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<GuestPlayer?> GetByNameAsync(Guid userId, string name, CancellationToken cancellationToken = default) =>
        await Db.GuestPlayers.FirstOrDefaultAsync(g => g.UserId == userId && g.Name == name, cancellationToken);

    public async Task AddAsync(GuestPlayer guestPlayer, CancellationToken cancellationToken = default)
    {
        await Db.GuestPlayers.AddAsync(guestPlayer, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public Task RemoveAsync(GuestPlayer guestPlayer, CancellationToken cancellationToken = default)
    {
        Db.GuestPlayers.Remove(guestPlayer);
        return SaveChangesAsync(cancellationToken);
    }
}
