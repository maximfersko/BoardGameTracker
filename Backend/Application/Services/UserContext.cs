using System;
using Application.Exceptions;
using Application.Interfaces;

namespace Application.Services;

internal static class UserContext
{
    public static Guid GetCurrentUserId(ICurrentUserService currentUser) =>
        currentUser.UserId ?? throw new UnauthorizedException();
}
