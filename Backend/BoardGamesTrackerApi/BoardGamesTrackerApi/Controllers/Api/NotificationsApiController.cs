using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoardGamesTrackerApi.Controllers.Api;

[ApiController]
[Authorize]
[Route("api/notifications")]
public class NotificationsApiController : ControllerBase
{
    private readonly INotificationService _notifications;

    public NotificationsApiController(INotificationService notifications) => _notifications = notifications;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 10) =>
        Ok(await _notifications.GetForCurrentUserAsync(page, pageSize));

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        var marked = await _notifications.MarkAsReadAsync(id);
        if (!marked) return NotFound();
        return Ok();
    }
}
