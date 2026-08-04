namespace Application.Dtos;

public class SessionPlayerDto
{
    public string Name { get; set; }
    public int Score { get; set; }
    public string Color { get; set; }
    public bool IsWinner { get; set; }
    public bool IsRegistered { get; set; }
}
