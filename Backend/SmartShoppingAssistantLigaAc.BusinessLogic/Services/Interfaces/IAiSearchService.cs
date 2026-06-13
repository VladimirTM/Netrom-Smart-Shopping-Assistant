using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IAiSearchService
{
    Task<List<ProductGetDTO>> SearchAsync(string query);
}
