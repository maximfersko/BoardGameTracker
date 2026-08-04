using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class CreateSessionRequestDto
{
    [Required(ErrorMessage = "Выберите игру")]
    public Guid GameId { get; set; }

    public DateTime PlayedAt { get; set; }

    public List<CreateSessionPlayerDto> Players { get; set; } = new();
}
