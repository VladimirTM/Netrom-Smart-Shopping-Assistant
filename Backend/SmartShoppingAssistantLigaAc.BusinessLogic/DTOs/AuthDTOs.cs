using System.ComponentModel.DataAnnotations;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public record LoginRequest(
    [Required][EmailAddress] string Email,
    [Required][StringLength(100, MinimumLength = 1)] string Password);

public record RegisterRequest(
    [Required][EmailAddress][StringLength(200)] string Email,
    [Required][StringLength(100, MinimumLength = 8)] string Password);

public record AuthResponse(string Token, string Role, string Email, int UserId);

public record UserDto(int Id, string Email, string Role, DateTime CreatedAt, string? DisplayName);

public record UpdateProfileRequest(string? DisplayName);

public record ChangePasswordRequest(
    [Required][StringLength(100, MinimumLength = 1)] string CurrentPassword,
    [Required][StringLength(100, MinimumLength = 8)] string NewPassword);
