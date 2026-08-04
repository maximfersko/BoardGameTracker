namespace Application.Dtos;

public class AuthResult
{
    public bool Succeeded { get; set; }
    public string Error { get; set; }
    public AuthUserDto User { get; set; }
}
