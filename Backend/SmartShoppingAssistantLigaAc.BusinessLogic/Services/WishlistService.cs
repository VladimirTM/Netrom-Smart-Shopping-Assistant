using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class WishlistService(IWishlistRepository wishlistRepository) : IWishlistService
{
    public async Task<WishlistGetDTO> GetAsync(int userId)
    {
        var items = await wishlistRepository.GetAllForUserAsync(userId);
        return new WishlistGetDTO { ProductIds = items.Select(w => w.ProductId).ToList() };
    }

    public async Task<WishlistGetDTO> AddAsync(int productId, int userId)
    {
        var existing = await wishlistRepository.FindByUserAndProductAsync(userId, productId);
        if (existing is null)
            await wishlistRepository.AddAsync(new WishlistItem { ProductId = productId, UserId = userId });
        return await GetAsync(userId);
    }

    public async Task<WishlistGetDTO> RemoveAsync(int productId, int userId)
    {
        var item = await wishlistRepository.FindByUserAndProductAsync(userId, productId);
        if (item is not null)
            await wishlistRepository.DeleteAsync(item.Id);
        return await GetAsync(userId);
    }
}
