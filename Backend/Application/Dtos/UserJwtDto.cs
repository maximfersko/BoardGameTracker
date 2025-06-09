using System;

namespace Application.Dtos;

public class UserJwtDto
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
}