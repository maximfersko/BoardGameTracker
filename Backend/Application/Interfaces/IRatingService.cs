using System;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces;

public interface IRatingService
{
    Task<GameRatingDto> GetAsync(Guid gameId);
    Task RateAsync(Guid gameId, RateGameRequestDto request);
}
