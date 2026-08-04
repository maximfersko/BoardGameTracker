using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IGameSessionRepository
{
    Task<(List<GameSession> Items, int TotalCount)> GetPagedForUserAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<GameSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<int> CountForGameAsync(Guid gameId, CancellationToken cancellationToken = default);
    Task AddAsync(GameSession session, CancellationToken cancellationToken = default);
    Task UpdateAsync(GameSession session, List<GameSessionResult> newResults, CancellationToken cancellationToken = default);
    Task DeleteAsync(GameSession session, CancellationToken cancellationToken = default);
}
