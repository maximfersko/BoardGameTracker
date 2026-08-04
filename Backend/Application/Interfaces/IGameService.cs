using System;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface IGameService
{
    Task<PagedResultDto<GameDto>> GetPagedAsync(string? search, int page, int pageSize);
    Task<GameDto?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(CreateGameRequestDto request);
}
