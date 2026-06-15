using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class ActivityLogRepository(SmartShoppingAssistantDbContext context) : IActivityLogRepository
{
    public async Task AddAsync(ActivityLog entry)
    {
        context.ActivityLogs.Add(entry);
        await context.SaveChangesAsync();
    }

    public async Task<List<ActivityLog>> GetLatestAsync(int limit, int offset = 0)
    {
        return await context.ActivityLogs
            .OrderByDescending(a => a.OccurredAt)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await context.ActivityLogs.CountAsync();
    }
}
