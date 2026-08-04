using System;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface IUserService
{
    Task<PagedResultDto<UserListItemDto>> GetPagedAsync(string? search, int page, int pageSize);
    Task<UserDetailDto?> GetByIdAsync(Guid id);
}
