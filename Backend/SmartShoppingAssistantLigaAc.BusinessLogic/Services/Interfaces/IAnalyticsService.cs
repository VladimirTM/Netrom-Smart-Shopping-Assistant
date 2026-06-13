using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsSummaryDTO> GetSummaryAsync();
}
