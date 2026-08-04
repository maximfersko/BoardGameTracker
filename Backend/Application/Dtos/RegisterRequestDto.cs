using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Введите email")]
    [EmailAddress(ErrorMessage = "Некорректный email")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Введите имя")]
    [MinLength(2, ErrorMessage = "Имя должно быть не короче 2 символов")]
    public string DisplayName { get; set; }

    [Required(ErrorMessage = "Введите пароль")]
    [MinLength(6, ErrorMessage = "Пароль должен быть не короче 6 символов")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Повторите пароль")]
    public string ConfirmPassword { get; set; }
}
