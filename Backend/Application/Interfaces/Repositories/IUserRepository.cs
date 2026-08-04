using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<(List<User> Items, int TotalCount)> GetPagedWithCountsAsync(string? search, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<User?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByDisplayNameAsync(string displayName, CancellationToken cancellationToken = default);
    Task<List<User>> GetSubscribersAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<User>> GetFollowingAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<User>> GetFriendsAsync(Guid userId, CancellationToken cancellationToken = default);
}
