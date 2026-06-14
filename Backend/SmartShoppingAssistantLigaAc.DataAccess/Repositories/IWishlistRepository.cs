using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IWishlistRepository : IRepository<WishlistItem>
{
    Task<List<WishlistItem>> GetAllForUserAsync(int userId);
    Task<WishlistItem?> FindByUserAndProductAsync(int userId, int productId);
}
