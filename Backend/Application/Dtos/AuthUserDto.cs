using System;

namespace Application.Dtos;

public class AuthUserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string DisplayName { get; set; }
    public DateTime RegisteredAt { get; set; }
}
