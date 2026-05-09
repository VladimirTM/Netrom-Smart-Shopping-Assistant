using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class ProductRepository(SmartShoppingAssistantDbContext context) : BaseRepository<Product>(context), IProductRepository
{
    public async Task<Product> GetByIdWithCategoriesAsync(int id)
    {
        var product = await Context.Set<Product>()
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            throw new KeyNotFoundException($"Product with id {id} not found");
        }

        return product;
    }

    public async Task<List<Product>> GetAllWithCategoriesAsync()
    {
        return await Context.Set<Product>()
            .Include(p => p.Categories)
            .ToListAsync();
    }
}
