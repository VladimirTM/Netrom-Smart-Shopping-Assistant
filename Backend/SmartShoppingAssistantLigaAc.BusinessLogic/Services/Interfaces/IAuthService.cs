using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserDto> GetCurrentUserAsync(int userId);
}
