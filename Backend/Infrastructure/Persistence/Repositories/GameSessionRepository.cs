using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class GameSessionRepository : RepositoryBase, IGameSessionRepository
{
    public GameSessionRepository(ApplicationDbContext db) : base(db) { }

    public async Task<(List<GameSession> Items, int TotalCount)> GetPagedForUserAsync(
        Guid userId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = Db.GameSessions
            .Where(s => s.CreatedById == userId || s.Results.Any(r => r.UserId == userId))
            .Include(s => s.Game)
            .Include(s => s.Results)
                .ThenInclude(r => r.User);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(s => s.PlayedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<GameSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await Db.GameSessions
            .Include(s => s.Game)
            .Include(s => s.Results)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

    public async Task<int> CountForGameAsync(Guid gameId, CancellationToken cancellationToken = default) =>
        await Db.GameSessions.CountAsync(s => s.GameId == gameId, cancellationToken);

    public async Task AddAsync(GameSession session, CancellationToken cancellationToken = default)
    {
        await Db.GameSessions.AddAsync(session, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(GameSession session, List<GameSessionResult> newResults, CancellationToken cancellationToken = default)
    {
        Db.GameSessionResults.RemoveRange(session.Results);
        Db.GameSessionResults.AddRange(newResults);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(GameSession session, CancellationToken cancellationToken = default)
    {
        Db.GameSessionResults.RemoveRange(session.Results);
        Db.GameSessions.Remove(session);
        await SaveChangesAsync(cancellationToken);
    }
}
