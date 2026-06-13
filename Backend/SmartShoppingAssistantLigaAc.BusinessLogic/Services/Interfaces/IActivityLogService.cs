using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IActivityLogService
{
    Task LogAsync(string action, string entityType, int entityId, string entityName, int? actorId = null, string? actorEmail = null);
    Task<List<ActivityLogGetDTO>> GetLatestAsync(int limit = 50);
}
