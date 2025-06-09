namespace Application.Interfaces;

using System.Threading.Tasks;
using Application.Dtos;

public interface IAuthService
{
    Task RegisterAsync(UserRegisterDto dto);
    Task<UserJwtDto> LoginAsync(UserLoginDto dto);
    Task<UserJwtDto> RefreshTokenAsync(string token, string refreshToken);
}