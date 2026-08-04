using System.Threading;
using System.Threading.Tasks;
using Infrastructure.Persistence;

namespace Infrastructure.Persistence.Repositories;

public abstract class RepositoryBase
{
    protected readonly ApplicationDbContext Db;

    protected RepositoryBase(ApplicationDbContext db) => Db = db;

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        Db.SaveChangesAsync(cancellationToken);
}
