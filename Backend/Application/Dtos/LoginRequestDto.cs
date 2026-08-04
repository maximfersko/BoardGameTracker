using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Введите email")]
    [EmailAddress(ErrorMessage = "Некорректный email")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Введите пароль")]
    public string Password { get; set; }

    public bool RememberMe { get; set; }
}
