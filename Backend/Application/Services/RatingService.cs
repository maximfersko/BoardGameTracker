using System;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.Interfaces.Repositories;

namespace Application.Services;

public class RatingService : IRatingService
{
    private readonly IRatingRepository _ratings;
    private readonly IGameRepository _games;
    private readonly ICurrentUserService _currentUser;

    public RatingService(IRatingRepository ratings, IGameRepository games, ICurrentUserService currentUser)
    {
        _ratings = ratings;
        _games = games;
        _currentUser = currentUser;
    }

    public async Task<GameRatingDto> GetAsync(Guid gameId)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var rating = await _ratings.GetAsync(gameId, userId);

        return new GameRatingDto
        {
            GameId = gameId,
            Value = rating?.Value ?? 0
        };
    }

    public async Task RateAsync(Guid gameId, RateGameRequestDto request)
    {
        var userId = UserContext.GetCurrentUserId(_currentUser);

        var game = await _games.GetByIdAsync(gameId);
        if (game == null) throw new KeyNotFoundException("Игра не найдена");

        var rating = await _ratings.GetAsync(gameId, userId);

        if (request.Value <= 0)
        {
            if (rating != null) await _ratings.RemoveAsync(rating);
            return;
        }

        if (rating == null)
        {
            await _ratings.AddAsync(new Domain.Entities.Rating
            {
                Id = Guid.NewGuid(),
                GameId = gameId,
                UserId = userId,
                Value = request.Value,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            rating.Value = request.Value;
            await _ratings.UpdateAsync(rating);
        }
    }
}
