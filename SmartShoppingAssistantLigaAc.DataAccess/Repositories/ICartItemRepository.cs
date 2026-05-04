using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface ICartItemRepository : IRepository<CartItem>
{
    Task<CartItem> GetByIdWithProductAsync(int id);
    Task<List<CartItem>> GetAllWithProductAndCategoriesAsync();
}

