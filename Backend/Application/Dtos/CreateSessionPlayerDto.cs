namespace Application.Dtos;

public class CreateSessionPlayerDto
{
    public Guid? UserId { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public string? Color { get; set; }
    public bool IsWinner { get; set; }
}
