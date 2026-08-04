using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class CreateCollectionRequestDto
{
    [Required(ErrorMessage = "Введите название коллекции")]
    [MaxLength(100, ErrorMessage = "Название коллекции не длиннее 100 символов")]
    public string Name { get; set; }
}
