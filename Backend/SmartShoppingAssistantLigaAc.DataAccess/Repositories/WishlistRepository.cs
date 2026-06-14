using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class WishlistRepository(SmartShoppingAssistantDbContext context)
    : BaseRepository<WishlistItem>(context), IWishlistRepository
{
    public async Task<List<WishlistItem>> GetAllForUserAsync(int userId) =>
        await Context.Set<WishlistItem>().Where(w => w.UserId == userId).ToListAsync();

    public async Task<WishlistItem?> FindByUserAndProductAsync(int userId, int productId) =>
        await Context.Set<WishlistItem>()
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
}
