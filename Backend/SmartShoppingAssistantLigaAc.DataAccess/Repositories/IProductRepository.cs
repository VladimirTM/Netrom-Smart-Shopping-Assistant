using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IProductRepository : IRepository<Product>
{
    Task<Product> GetByIdWithCategoriesAsync(int id);
    Task<List<Product>> GetAllWithCategoriesAsync();
}