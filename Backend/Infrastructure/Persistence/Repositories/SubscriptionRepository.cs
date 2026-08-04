using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class SubscriptionRepository : RepositoryBase, ISubscriptionRepository
{
    public SubscriptionRepository(ApplicationDbContext db) : base(db) { }

    public async Task<Subscription?> GetAsync(Guid followerId, Guid followingId, CancellationToken cancellationToken = default) =>
        await Db.Subscriptions.FirstOrDefaultAsync(
            s => s.FollowerId == followerId && s.FollowingId == followingId, cancellationToken);

    public async Task AddAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        await Db.Subscriptions.AddAsync(subscription, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        Db.Subscriptions.Remove(subscription);
        await SaveChangesAsync(cancellationToken);
    }
}
