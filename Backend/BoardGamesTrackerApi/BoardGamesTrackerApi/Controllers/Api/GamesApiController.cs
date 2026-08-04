using System;
using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BoardGamesTrackerApi.Controllers.Api;

[ApiController]
[Route("api/games")]
public class GamesApiController : ControllerBase
{
    private readonly IGameService _games;
    private readonly IRatingService _ratings;

    public GamesApiController(IGameService games, IRatingService ratings)
    {
        _games = games;
        _ratings = ratings;
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 12) =>
        Ok(await _games.GetPagedAsync(search, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var game = await _games.GetByIdAsync(id);
        if (game == null) return NotFound();
        return Ok(game);
    }

    [HttpGet("{id:guid}/rating")]
    public async Task<IActionResult> GetRating(Guid id) => Ok(await _ratings.GetAsync(id));

    [HttpPost("{id:guid}/rating")]
    public async Task<IActionResult> Rate(Guid id, [FromBody] RateGameRequestDto request)
    {
        await _ratings.RateAsync(id, request);
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGameRequestDto request)
    {
        var id = await _games.CreateAsync(request);
        return Ok(new { id });
    }
}
