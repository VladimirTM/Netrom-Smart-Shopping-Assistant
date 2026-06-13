using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IActivityLogRepository
{
    Task AddAsync(ActivityLog entry);
    Task<List<ActivityLog>> GetLatestAsync(int limit);
}
