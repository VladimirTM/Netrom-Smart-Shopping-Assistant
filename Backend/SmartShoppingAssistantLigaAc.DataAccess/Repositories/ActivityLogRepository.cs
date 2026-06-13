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

    public async Task<List<ActivityLog>> GetLatestAsync(int limit)
    {
        return await context.ActivityLogs
            .OrderByDescending(a => a.OccurredAt)
            .Take(limit)
            .ToListAsync();
    }
}
