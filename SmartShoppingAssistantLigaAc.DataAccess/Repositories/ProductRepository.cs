using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class ProductRepository(SmartShoppingAssistantDbContext context) : BaseRepository<Product>(context), IProductRepository
{
    public async Task<Product> GetByIdWithCategoriesAsync(int id)
    {
        try
        {
            var product = await context.Set<Product>()
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                throw new Exception($"Product with id {id} not found");
            }

            return product;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error retrieving product with id {id}: {ex.Message}", ex);
        }
    }

    public async Task<List<Product>> GetAllWithCategoriesAsync()
    {
        try
        {
            return await context.Set<Product>()
                .Include(p => p.Categories)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception($"Error retrieving products: {ex.Message}", ex);
        }
    }
}