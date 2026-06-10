using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface ICartItemService
{
    Task<CartGetDTO> GetAllAsync(int userId);
    Task<CartItemGetDTO> GetByIdAsync(int id);
    Task<CartGetDTO> CreateAsync(CartItemCreateDTO dto, int userId);
    Task<CartGetDTO> UpdateAsync(int id, CartItemUpdateDTO dto);
    Task<CartGetDTO> DeleteAsync(int id);
    Task DeleteAllAsync(int userId);
    Task<AnalysisResponse> AnalyzeCartAsync(int userId);
}
