using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class GameRepository : RepositoryBase, IGameRepository
{
    public GameRepository(ApplicationDbContext db) : base(db) { }

    public async Task<(List<Game> Items, int TotalCount)> GetPagedAsync(
        string? search, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = Db.Games.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(g =>
                g.TitleRu.Contains(term) ||
                g.TitleEn.Contains(term) ||
                g.Alias.Contains(term));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(g => g.TitleRu)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Game?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await Db.Games.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);

    public async Task<Game?> GetByAliasAsync(string alias, CancellationToken cancellationToken = default) =>
        await Db.Games.FirstOrDefaultAsync(g => g.Alias == alias, cancellationToken);

    public async Task AddAsync(Game game, CancellationToken cancellationToken = default)
    {
        await Db.Games.AddAsync(game, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }
}
