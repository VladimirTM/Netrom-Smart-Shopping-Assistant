using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class CartItemRepository(SmartShoppingAssistantDbContext context) : BaseRepository<CartItem>(context), ICartItemRepository
{
    public async Task<CartItem> GetByIdWithProductAsync(int id)
    {
        var cartItem = await Context.Set<CartItem>()
            .Include(c => c.Product)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cartItem == null)
        {
            throw new KeyNotFoundException($"Cart item with id {id} not found");
        }

        return cartItem;
    }

    public async Task<List<CartItem>> GetAllWithProductAndCategoriesAsync(int userId)
    {
        return await Context.Set<CartItem>()
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
                .ThenInclude(p => p.Categories)
            .ToListAsync();
    }

    public async Task DeleteAllForUserAsync(int userId)
    {
        var items = await Context.Set<CartItem>()
            .Where(c => c.UserId == userId)
            .ToListAsync();
        Context.Set<CartItem>().RemoveRange(items);
        await Context.SaveChangesAsync();
    }
}
