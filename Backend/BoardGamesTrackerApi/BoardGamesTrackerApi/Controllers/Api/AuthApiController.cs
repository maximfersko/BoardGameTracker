using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BoardGamesTrackerApi.Controllers.Api;

[ApiController]
[Route("api/auth")]
public class AuthApiController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AuthApiController(IAccountService accountService) => _accountService = accountService;

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var result = await _accountService.GetCurrentUserAsync();
        if (!result.Succeeded) return Unauthorized();
        return Ok(result.User);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _accountService.LoginAsync(request);
        if (!result.Succeeded) return Unauthorized(new { error = result.Error });
        return Ok(result.User);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await _accountService.RegisterAsync(request);
        if (!result.Succeeded) return BadRequest(new { error = result.Error });
        return Ok(result.User);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _accountService.LogoutAsync();
        return Ok();
    }
}
