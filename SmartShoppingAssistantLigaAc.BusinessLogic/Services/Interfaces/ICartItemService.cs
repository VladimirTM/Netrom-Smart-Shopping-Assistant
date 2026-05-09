using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface ICartItemService
{
    Task<CartGetDTO> GetAllAsync();
    Task<CartItemGetDTO> GetByIdAsync(int id);
    Task<CartGetDTO> CreateAsync(CartItemCreateDTO dto);
    Task<CartGetDTO> UpdateAsync(int id, CartItemUpdateDTO dto);
    Task<CartGetDTO> DeleteAsync(int id);
    Task DeleteAllAsync();
}
