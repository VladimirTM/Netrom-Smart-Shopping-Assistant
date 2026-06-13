using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface ICartItemService
{
    Task<CartGetDTO> GetAllAsync(int userId);
    Task<CartItemGetDTO> GetByIdAsync(int id, int userId);
    Task<CartGetDTO> CreateAsync(CartItemCreateDTO dto, int userId);
    Task<CartGetDTO> UpdateAsync(int id, CartItemUpdateDTO dto, int userId);
    Task<CartGetDTO> DeleteAsync(int id, int userId);
    Task DeleteAllAsync(int userId);
    Task<AnalysisResponse> AnalyzeCartAsync(int userId);
}
