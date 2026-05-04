using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class CartItemRepository(SmartShoppingAssistantDbContext context)
    : BaseRepository<CartItem>(context), ICartItemRepository
{
    public async Task<CartItem> GetByIdWithProductAsync(int id)
    {
        try
        {
            var cartItem = await context.Set<CartItem>()
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cartItem == null)
            {
                throw new Exception($"Cart item with id {id} not found");
            }

            return cartItem;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error retrieving cart item with id {id}: {ex.Message}", ex);
        }
    }

    public async Task<List<CartItem>> GetAllWithProductAndCategoriesAsync()
    {
        try
        {
            return await context.Set<CartItem>()
                .Include(c => c.Product)
                    .ThenInclude(p => p.Categories)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception($"Error retrieving cart items: {ex.Message}", ex);
        }
    }
}

