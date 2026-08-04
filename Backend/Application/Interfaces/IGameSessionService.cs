using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface IGameSessionService
{
    Task<PagedResultDto<SessionDto>> GetForCurrentUserAsync(int page, int pageSize);
    Task<List<GuestPlayerDto>> GetGuestsAsync();
    Task<Guid> CreateAsync(CreateSessionRequestDto request);
    Task UpdateAsync(Guid id, CreateSessionRequestDto request);
    Task DeleteAsync(Guid id);
}
