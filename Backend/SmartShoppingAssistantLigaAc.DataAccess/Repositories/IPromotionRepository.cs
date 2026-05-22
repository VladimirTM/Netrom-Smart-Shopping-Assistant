using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IPromotionRepository : IRepository<Promotion>
{
    Task<List<Promotion>> GetForProductAsync(int productId);
}