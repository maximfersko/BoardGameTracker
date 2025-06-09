namespace Application.Dtos;

public class TokenRefreshRequest
{
    public string Token { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}