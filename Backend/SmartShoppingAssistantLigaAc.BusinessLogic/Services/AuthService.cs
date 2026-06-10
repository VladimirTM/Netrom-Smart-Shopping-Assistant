using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class AuthService(IUserRepository userRepository, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existing = await userRepository.FindByEmailAsync(request.Email);
        if (existing is not null)
            throw new InvalidOperationException("A user with this email already exists.");

        var user = new User
        {
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "user",
            CreatedAt = DateTime.UtcNow
        };

        await userRepository.AddAsync(user);
        return new AuthResponse(GenerateToken(user), user.Role, user.Email, user.Id);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await userRepository.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return new AuthResponse(GenerateToken(user), user.Role, user.Email, user.Id);
    }

    public async Task<UserDto> GetCurrentUserAsync(int userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        return new UserDto(user.Id, user.Email, user.Role, user.CreatedAt);
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured.")));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
        };

        var expiresDays = int.TryParse(configuration["Jwt:ExpiresInDays"], out var d) ? d : 7;

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiresDays),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
