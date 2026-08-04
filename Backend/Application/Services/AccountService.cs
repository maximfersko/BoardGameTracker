using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Application.Services;

public class AccountService : IAccountService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ICurrentUserService _currentUser;
    private readonly ICollectionRepository _collections;

    public AccountService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        ICurrentUserService currentUser,
        ICollectionRepository collections)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _currentUser = currentUser;
        _collections = collections;
    }

    public async Task<AuthResult> GetCurrentUserAsync()
    {
        if (!_currentUser.UserId.HasValue)
            return new AuthResult { Succeeded = false, Error = "Не авторизован" };

        var user = await _userManager.FindByIdAsync(_currentUser.UserId.Value.ToString());
        if (user == null)
            return new AuthResult { Succeeded = false, Error = "Не авторизован" };

        return new AuthResult { Succeeded = true, User = ToDto(user) };
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequestDto request)
    {
        if (request.Password != request.ConfirmPassword)
            return new AuthResult { Succeeded = false, Error = "Пароли не совпадают" };

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName,
            RegisteredAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return new AuthResult { Succeeded = false, Error = string.Join("; ", result.Errors.Select(e => e.Description)) };

        await _collections.AddRangeAsync(DefaultCollections.Names
            .Select(name => new Collection
            {
                Id = Guid.NewGuid(),
                Name = name,
                UserId = user.Id,
                Items = new List<CollectionItem>()
            }));

        await _signInManager.SignInAsync(user, isPersistent: false);
        return new AuthResult { Succeeded = true, User = ToDto(user) };
    }

    public async Task<AuthResult> LoginAsync(LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return new AuthResult { Succeeded = false, Error = "Неверный email или пароль" };

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, lockoutOnFailure: false);
        if (!result.Succeeded)
            return new AuthResult { Succeeded = false, Error = "Неверный email или пароль" };

        return new AuthResult { Succeeded = true, User = ToDto(user) };
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    private static AuthUserDto ToDto(User user) => new()
    {
        Id = user.Id,
        UserName = user.UserName,
        Email = user.Email,
        DisplayName = user.DisplayName,
        RegisteredAt = user.RegisteredAt
    };
}
