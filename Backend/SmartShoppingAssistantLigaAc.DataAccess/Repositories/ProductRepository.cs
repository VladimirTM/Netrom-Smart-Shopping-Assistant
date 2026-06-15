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

    public async Task<List<Product>> GetByIdsAsync(IEnumerable<int> ids)
    {
        var idList = ids.ToList();
        return await Context.Set<Product>()
            .Include(p => p.Categories)
            .Where(p => idList.Contains(p.Id))
            .ToListAsync();
    }

    public async Task<List<Product>> GetRelatedAsync(int productId, int limit = 6)
    {
        var sourceCategoryIds = Context.Set<Product>()
            .Where(p => p.Id == productId)
            .SelectMany(p => p.Categories.Select(c => c.Id));

        return await Context.Set<Product>()
            .Include(p => p.Categories)
            .Where(p => p.Id != productId && p.Categories.Any(c => sourceCategoryIds.Contains(c.Id)))
            .Take(limit)
            .ToListAsync();
    }
}
