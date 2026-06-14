using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IWishlistService
{
    Task<WishlistGetDTO> GetAsync(int userId);
    Task<WishlistGetDTO> AddAsync(int productId, int userId);
    Task<WishlistGetDTO> RemoveAsync(int productId, int userId);
}
