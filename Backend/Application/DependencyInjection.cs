using Application.Interfaces;
using Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IGameService, GameService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICollectionService, CollectionService>();
        services.AddScoped<IGameSessionService, GameSessionService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddScoped<IRatingService, RatingService>();
        services.AddScoped<INotificationService, NotificationService>();

        return services;
    }
}
