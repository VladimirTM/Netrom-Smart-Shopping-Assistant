using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface ICartItemService
{
    Task<List<CartItemGetDTO>> GetAllAsync();
    Task<CartItemGetDTO> GetByIdAsync(int id);
    Task<CartItemGetDTO> CreateAsync(CartItemCreateDTO dto);
    Task<CartItemGetDTO> UpdateAsync(int itemId, CartItemUpdateDTO dto);
    Task DeleteAsync(int id);
    Task DeleteAllAsync();
}