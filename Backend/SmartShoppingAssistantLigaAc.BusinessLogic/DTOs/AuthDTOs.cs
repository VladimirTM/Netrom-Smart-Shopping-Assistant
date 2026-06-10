namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Email, string Password);

public record AuthResponse(string Token, string Role, string Email, int UserId);

public record UserDto(int Id, string Email, string Role, DateTime CreatedAt);
