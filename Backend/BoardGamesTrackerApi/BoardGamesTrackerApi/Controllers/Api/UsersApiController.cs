using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoardGamesTrackerApi.Controllers.Api;

[ApiController]
[Route("api/users")]
public class UsersApiController : ControllerBase
{
    private readonly IUserService _users;
    private readonly ISubscriptionService _subscriptions;

    public UsersApiController(IUserService users, ISubscriptionService subscriptions)
    {
        _users = users;
        _subscriptions = subscriptions;
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 12) =>
        Ok(await _users.GetPagedAsync(search, page, pageSize));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost("{id}/subscribe")]
    [Authorize]
    public async Task<IActionResult> Subscribe(Guid id) => Ok(await _subscriptions.SubscribeAsync(id));

    [HttpPost("{id}/unsubscribe")]
    [Authorize]
    public async Task<IActionResult> Unsubscribe(Guid id)
    {
        await _subscriptions.UnsubscribeAsync(id);
        return Ok();
    }

    [HttpGet("{id}/subscribers")]
    public async Task<IActionResult> Subscribers(Guid id) => Ok(await _subscriptions.GetSubscribersAsync(id));

    [HttpGet("{id}/following")]
    public async Task<IActionResult> Following(Guid id) => Ok(await _subscriptions.GetFollowingAsync(id));

    [HttpGet("{id}/friends")]
    public async Task<IActionResult> Friends(Guid id) => Ok(await _subscriptions.GetFriendsAsync(id));
}
