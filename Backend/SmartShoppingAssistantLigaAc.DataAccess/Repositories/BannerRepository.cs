using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class BannerRepository(SmartShoppingAssistantDbContext context)
    : BaseRepository<Banner>(context), IBannerRepository
{
    public async Task<List<Banner>> GetAllActiveAsync() =>
        await GetAllAsQueryable()
            .Where(b => b.IsActive)
            .OrderBy(b => b.DisplayOrder)
            .ToListAsync();
}
