using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface IAccountService
{
    Task<AuthResult> GetCurrentUserAsync();
    Task<AuthResult> RegisterAsync(RegisterRequestDto request);
    Task<AuthResult> LoginAsync(LoginRequestDto request);
    Task LogoutAsync();
}
