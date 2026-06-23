using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IBannerRepository : IRepository<Banner>
{
    Task<List<Banner>> GetAllActiveAsync();
}
