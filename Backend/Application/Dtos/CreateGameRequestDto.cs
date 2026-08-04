using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class CreateGameRequestDto
{
    [Required(ErrorMessage = "Введите алиас игры")]
    [MaxLength(200, ErrorMessage = "Алиас слишком длинный")]
    public string Alias { get; set; }

    [Required(ErrorMessage = "Введите название игры на русском")]
    [MaxLength(200, ErrorMessage = "Название слишком длинное")]
    public string TitleRu { get; set; }

    [Required(ErrorMessage = "Введите название игры на английском")]
    [MaxLength(200, ErrorMessage = "Название слишком длинное")]
    public string TitleEn { get; set; }

    [MaxLength(2000, ErrorMessage = "URL изображения слишком длинный")]
    public string? ImageUrl { get; set; }

    [Range(1, 99, ErrorMessage = "Минимальное число игроков от 1 до 99")]
    public int MinPlayers { get; set; }

    [Range(1, 99, ErrorMessage = "Максимальное число игроков от 1 до 99")]
    public int MaxPlayers { get; set; }

    [Range(0, 99, ErrorMessage = "Возраст от 0 до 99")]
    public int MinAge { get; set; }

    [Range(1, 1440, ErrorMessage = "Время партии от 1 до 1440 минут")]
    public int MinPlayTime { get; set; }

    [Range(1, 1440, ErrorMessage = "Время партии от 1 до 1440 минут")]
    public int MaxPlayTime { get; set; }

    [Range(1900, 2100, ErrorMessage = "Год выпуска от 1900 до 2100")]
    public int YearPublished { get; set; }
}
