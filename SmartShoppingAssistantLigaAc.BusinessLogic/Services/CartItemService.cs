using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class CartItemService(IRepository<CartItem> cartItemRepository) : ICartItemService
{ 
    public async Task<List<CartItemGetDTO>> GetAllAsync()
    {
        var cartItems = await cartItemRepository.GetAllAsync();
        
        return cartItems.Select(MapToDto).ToList();
    }

    public async Task<CartItemGetDTO> GetByIdAsync(int id)
    {
        var cartItem = await cartItemRepository.GetByIdAsync(id);
        return MapToDto(cartItem);
    }

    public async Task<CartItemGetDTO> CreateAsync(CartItemCreateDTO dto)
    {
        var cartItem = new CartItem
        {
            ProductId = dto.ProductId,
            Quantity = dto.Quantity
        };
        
        var created = await cartItemRepository.AddAsync(cartItem);
        return MapToDto(created);
    }

    public async Task<CartItemGetDTO> UpdateAsync(int itemId, CartItemUpdateDTO dto)
    {
        var cartItem = await cartItemRepository.GetByIdAsync(itemId);
        
        cartItem.ProductId = dto.ProductId;
        cartItem.Quantity = dto.Quantity;
        
        var updated = await cartItemRepository.UpdateAsync(cartItem);
        return MapToDto(updated);
    }

    public async Task DeleteAsync(int id)
    {
        await cartItemRepository.DeleteAsync(id);
    }

    public async Task DeleteAllAsync()
    {
        await cartItemRepository.DeleteAllAsync();
    }
    
    private static CartItemGetDTO MapToDto(CartItem cartItem) => new()
    {
        Id = cartItem.Id,
        ProductId = cartItem.ProductId,
        Quantity = cartItem.Quantity,
    };
}