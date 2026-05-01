using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IPromotionService
{
    Task<List<PromotionGetDTO>> GetAllAsync();
    Task<PromotionGetDTO> GetByIdAsync(int id);
    Task<PromotionGetDTO> CreateAsync(PromotionCreateDTO dto);
    Task<PromotionGetDTO> UpdateAsync(int id, PromotionUpdateDTO dto);
    Task DeleteAsync(int id);
}