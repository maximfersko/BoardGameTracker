using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Exceptions;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Domain.Entities;

namespace Application.Services;

public class GameSessionService : IGameSessionService
{
    private readonly IGameSessionRepository _sessions;
    private readonly IGameRepository _games;
    private readonly IUserRepository _users;
    private readonly IGuestPlayerRepository _guests;
    private readonly ICurrentUserService _currentUser;

    public GameSessionService(
        IGameSessionRepository sessions,
        IGameRepository games,
        IUserRepository users,
        IGuestPlayerRepository guests,
        ICurrentUserService currentUser)
    {
        _sessions = sessions;
        _games = games;
        _users = users;
        _guests = guests;
        _currentUser = currentUser;
    }

    public async Task<PagedResultDto<SessionDto>> GetForCurrentUserAsync(int page, int pageSize)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (sessions, totalCount) = await _sessions.GetPagedForUserAsync(userId, page, pageSize);

        var items = sessions
            .Select(s =>
            {
                var hasWinners = s.Results.Any(r => r.IsWinner);
                return new SessionDto
                {
                    Id = s.Id,
                    GameId = s.GameId,
                    Game = s.Game?.TitleRu,
                    PlayedAt = s.PlayedAt,
                    PlayersCount = s.Results.Count,
                    Players = s.Results
                        .Select(r => new SessionPlayerDto
                        {
                            Name = r.User != null ? r.User.DisplayName : r.Notes,
                            Score = r.Score,
                            Color = r.Color,
                            IsWinner = hasWinners ? r.IsWinner : r.Score == s.Results.Max(x => x.Score),
                            IsRegistered = r.UserId != null
                        })
                        .ToList()
                };
            })
            .ToList();

        return PagedResultDto<SessionDto>.From(items, totalCount, page, pageSize);
    }

    public async Task<List<GuestPlayerDto>> GetGuestsAsync()
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var guests = await _guests.GetForUserAsync(userId);

        return guests
            .Select(g => new GuestPlayerDto
            {
                Id = g.Id,
                Name = g.Name,
                GamesCount = g.GamesCount
            })
            .ToList();
    }

    public async Task<Guid> CreateAsync(CreateSessionRequestDto request)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var game = await _games.GetByIdAsync(request.GameId);
        if (game == null)
            throw new ValidationException("Игра не найдена");

        var session = new GameSession
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
            CreatedById = userId,
            PlayedAt = request.PlayedAt
        };

        session.Results = await BuildResultsAsync(request.Players, session.Id, userId);

        await _sessions.AddAsync(session);

        await RememberGuestsAsync(request.Players, userId);

        return session.Id;
    }

    public async Task UpdateAsync(Guid id, CreateSessionRequestDto request)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var game = await _games.GetByIdAsync(request.GameId);
        if (game == null)
            throw new ValidationException("Игра не найдена");

        var session = await _sessions.GetByIdAsync(id);
        if (session == null)
            throw new NotFoundException("Партия не найдена");
        if (session.CreatedById != userId)
            throw new UnauthorizedException("Нет доступа к этой партии");

        var oldGuestNames = GetGuestNames(session.Results);
        var newResults = await BuildResultsAsync(request.Players, session.Id, userId);

        session.GameId = game.Id;
        session.PlayedAt = request.PlayedAt;
        await _sessions.UpdateAsync(session, newResults);

        await RememberGuestsAsync(request.Players, userId);
        await ForgetGuestsAsync(oldGuestNames, request.Players, userId);
    }

    public async Task DeleteAsync(Guid id)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var session = await _sessions.GetByIdAsync(id);
        if (session == null)
            throw new NotFoundException("Партия не найдена");
        if (session.CreatedById != userId)
            throw new UnauthorizedException("Нет доступа к этой партии");

        await ForgetGuestsAsync(GetGuestNames(session.Results), new List<CreateSessionPlayerDto>(), userId);

        await _sessions.DeleteAsync(session);
    }

    private async Task<List<GameSessionResult>> BuildResultsAsync(List<CreateSessionPlayerDto> players, Guid sessionId, Guid userId)
    {
        var results = new List<GameSessionResult>();

        foreach (var player in players)
        {
            var registeredUserId = player.UserId;

            if (!registeredUserId.HasValue && !string.IsNullOrWhiteSpace(player.Name))
            {
                var registered = await _users.GetByDisplayNameAsync(player.Name.Trim());
                if (registered != null)
                    registeredUserId = registered.Id;
            }

            results.Add(new GameSessionResult
            {
                Id = Guid.NewGuid(),
                GameSessionId = sessionId,
                UserId = registeredUserId,
                Score = player.Score,
                Color = player.Color ?? "",
                IsWinner = player.IsWinner,
                Notes = player.Name
            });
        }

        return results;
    }

    private static List<string> GetGuestNames(IEnumerable<GameSessionResult> results) =>
        results
            .Where(r => r.UserId == null && !string.IsNullOrWhiteSpace(r.Notes))
            .Select(r => r.Notes.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

    private async Task RememberGuestsAsync(List<CreateSessionPlayerDto> players, Guid userId)
    {
        foreach (var player in players)
        {
            if (player.UserId.HasValue || string.IsNullOrWhiteSpace(player.Name)) continue;

            var name = player.Name.Trim();
            var guest = await _guests.GetByNameAsync(userId, name);

            if (guest == null)
            {
                await _guests.AddAsync(new GuestPlayer
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Name = name,
                    GamesCount = 1,
                    CreatedAt = DateTime.UtcNow
                });
            }
            else
            {
                guest.GamesCount++;
                await _guests.SaveChangesAsync();
            }
        }
    }

    private async Task ForgetGuestsAsync(List<string> oldGuestNames, List<CreateSessionPlayerDto> players, Guid userId)
    {
        var keptNames = players
            .Where(p => !p.UserId.HasValue && !string.IsNullOrWhiteSpace(p.Name))
            .Select(p => p.Name.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var name in oldGuestNames)
        {
            if (keptNames.Contains(name)) continue;

            var guest = await _guests.GetByNameAsync(userId, name);
            if (guest == null) continue;

            guest.GamesCount--;
            if (guest.GamesCount <= 0)
                await _guests.RemoveAsync(guest);
            else
                await _guests.SaveChangesAsync();
        }
    }
}
