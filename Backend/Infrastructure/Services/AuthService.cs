using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly IConfiguration _config;
    private readonly TokenValidationParameters _tokenValidationParams;

    public AuthService(
        UserManager<User> userManager,
        IMapper mapper,
        IConfiguration config,
        TokenValidationParameters tokenValidationParams)
    {
        _userManager = userManager;
        _mapper = mapper;
        _config = config;
        _tokenValidationParams = tokenValidationParams;
    }

    public async Task RegisterAsync(UserRegisterDto dto)
    {
        var user = _mapper.Map<User>(dto);
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) throw new ApplicationException("Registration failed");
    }

    public async Task<UserJwtDto> LoginAsync(UserLoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.UserName);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            throw new ApplicationException("Invalid credentials");
        return await GenerateTokensAsync(user);
    }

    public async Task<UserJwtDto> RefreshTokenAsync(string token, string refreshToken)
    {
        var principal = GetPrincipalFromToken(token);
        var userId = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);
        // Validate stored refresh token etc...
        return await GenerateTokensAsync(user);
    }

    private async Task<UserJwtDto> GenerateTokensAsync(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]);
        var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["TokenLifetimeMinutes"]));

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new Claim("displayName", user.DisplayName)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = tokenHandler.WriteToken(token);

        var refresh = Guid.NewGuid().ToString();
        // store refresh token in DB or cache with expiry...

        return new UserJwtDto
        {
            Token = jwtToken,
            RefreshToken = refresh,
            ExpiresAt = expires
        };
    }

    private ClaimsPrincipal GetPrincipalFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, _tokenValidationParams, out var validatedToken);
        if (!(validatedToken is JwtSecurityToken jwtToken) ||
            !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCulture))
        {
            throw new SecurityTokenException("Invalid token");
        }
        return principal;
    }
}