using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using BoardGamesTracker.Domain.Enums;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class UserRepository : RepositoryBase, IUserRepository
{
    public UserRepository(ApplicationDbContext db) : base(db) { }

    private IQueryable<User> WithCounts() => Db.Users
        .Include(u => u.Collections)
            .ThenInclude(c => c.Items)
        .Include(u => u.Followers)
        .Include(u => u.Following)
        .Include(u => u.GameSessions);

    public async Task<(List<User> Items, int TotalCount)> GetPagedWithCountsAsync(
        string? search, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = WithCounts();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(u => u.DisplayName.Contains(term) || u.Email.Contains(term));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(u => u.DisplayName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<User?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default) =>
        await WithCounts()
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await Db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public async Task<User?> GetByDisplayNameAsync(string displayName, CancellationToken cancellationToken = default) =>
        await Db.Users.FirstOrDefaultAsync(u => u.DisplayName == displayName, cancellationToken);

    public async Task<List<User>> GetSubscribersAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await WithCounts()
            .AsNoTracking()
            .Where(u => u.Following.Any(s => s.FollowingId == userId))
            .OrderBy(u => u.DisplayName)
            .ToListAsync(cancellationToken);

    public async Task<List<User>> GetFollowingAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await WithCounts()
            .AsNoTracking()
            .Where(u => u.Followers.Any(s => s.FollowerId == userId))
            .OrderBy(u => u.DisplayName)
            .ToListAsync(cancellationToken);

    public async Task<List<User>> GetFriendsAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await WithCounts()
            .AsNoTracking()
            .Where(u => u.Following.Any(s => s.FollowingId == userId && s.Status == SubscriptionStatus.Friend)
                     && u.Followers.Any(s => s.FollowerId == userId && s.Status == SubscriptionStatus.Friend))
            .OrderBy(u => u.DisplayName)
            .ToListAsync(cancellationToken);
}
