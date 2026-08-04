using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoardGamesTrackerApi.Controllers.Api;

[ApiController]
[Authorize]
[Route("api/sessions")]
public class SessionsApiController : ControllerBase
{
    private readonly IGameSessionService _sessions;

    public SessionsApiController(IGameSessionService sessions) => _sessions = sessions;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 10) =>
        Ok(await _sessions.GetForCurrentUserAsync(page, pageSize));

    [HttpGet("guests")]
    public async Task<IActionResult> Guests() => Ok(await _sessions.GetGuestsAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSessionRequestDto request)
    {
        var id = await _sessions.CreateAsync(request);
        return Ok(new { id });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateSessionRequestDto request)
    {
        await _sessions.UpdateAsync(id, request);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sessions.DeleteAsync(id);
        return Ok();
    }
}
