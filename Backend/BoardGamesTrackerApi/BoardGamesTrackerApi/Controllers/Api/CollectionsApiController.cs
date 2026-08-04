using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoardGamesTrackerApi.Controllers.Api;

[ApiController]
[Authorize]
[Route("api/collections")]
public class CollectionsApiController : ControllerBase
{
    private readonly ICollectionService _collections;

    public CollectionsApiController(ICollectionService collections) => _collections = collections;

    [HttpGet]
    public async Task<IActionResult> List() => Ok(await _collections.GetForCurrentUserAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCollectionRequestDto request)
    {
        var id = await _collections.CreateAsync(request);
        return Ok(new { id });
    }

    [HttpPost("{collectionId:guid}/games/{gameId:guid}")]
    public async Task<IActionResult> AddGame(Guid collectionId, Guid gameId)
    {
        await _collections.AddGameAsync(collectionId, gameId);
        return Ok(new { added = true });
    }

    [HttpDelete("{collectionId:guid}/games/{gameId:guid}")]
    public async Task<IActionResult> RemoveGame(Guid collectionId, Guid gameId)
    {
        await _collections.RemoveGameAsync(collectionId, gameId);
        return Ok(new { removed = true });
    }
}
