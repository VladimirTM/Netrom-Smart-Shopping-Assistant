using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class ActivityLogService(IActivityLogRepository activityLogRepository) : IActivityLogService
{
    public async Task LogAsync(string action, string entityType, int entityId, string entityName, int? actorId = null, string? actorEmail = null)
    {
        var entry = new ActivityLog
        {
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            EntityName = entityName,
            ActorId = actorId,
            ActorEmail = actorEmail,
            OccurredAt = DateTime.UtcNow
        };

        await activityLogRepository.AddAsync(entry);
    }

    public async Task<List<ActivityLogGetDTO>> GetLatestAsync(int limit = 50)
    {
        var logs = await activityLogRepository.GetLatestAsync(limit);
        return logs.Select(a => new ActivityLogGetDTO
        {
            Id = a.Id,
            Action = a.Action,
            EntityType = a.EntityType,
            EntityId = a.EntityId,
            EntityName = a.EntityName,
            ActorId = a.ActorId,
            ActorEmail = a.ActorEmail,
            OccurredAt = a.OccurredAt
        }).ToList();
    }
}
