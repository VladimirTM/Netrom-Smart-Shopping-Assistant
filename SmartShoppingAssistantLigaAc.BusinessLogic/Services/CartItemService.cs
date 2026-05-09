using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class CartItemService(
    ICartItemRepository cartItemRepository,
    IRepository<Promotion> promotionRepository) : ICartItemService
{
    public async Task<CartGetDTO> GetAllAsync()
    {
        var cartItems = await cartItemRepository.GetAllWithProductAndCategoriesAsync();
        var promotions = (await promotionRepository.GetAllAsync()).Where(p => p.IsActive).ToList();

        var subtotal = cartItems.Sum(i => i.Product.Price * i.Quantity);

        var appliedPromotions = promotions
            .Select(p => (Promotion: p, Discount: CalculateDiscount(p, cartItems, subtotal)))
            .Where(x => x.Discount > 0)
            .Select(x => new AppliedPromotionDTO { PromotionName = x.Promotion.Name, Discount = -x.Discount })
            .ToList();

        var totalDiscount = Math.Max(appliedPromotions.Sum(x => x.Discount), -subtotal);

        return new CartGetDTO
        {
            Items = cartItems.Select(MapToDTO).ToList(),
            Subtotal = subtotal,
            AppliedPromotions = appliedPromotions,
            TotalDiscount = totalDiscount,
            Total = subtotal + totalDiscount
        };
    }

    public async Task<CartItemGetDTO> GetByIdAsync(int id)
    {
        var cartItem = await cartItemRepository.GetByIdWithProductAsync(id);
        return MapToDTO(cartItem);
    }

    public async Task<CartGetDTO> CreateAsync(CartItemCreateDTO dto)
    {
        var cartItem = new CartItem
        {
            ProductId = dto.ProductId,
            Quantity = dto.Quantity
        };

        await cartItemRepository.AddAsync(cartItem);
        return await GetAllAsync();
    }

    public async Task<CartGetDTO> UpdateAsync(int id, CartItemUpdateDTO dto)
    {
        var cartItem = await cartItemRepository.GetByIdAsync(id);

        cartItem.Quantity = dto.Quantity;

        await cartItemRepository.UpdateAsync(cartItem);
        return await GetAllAsync();
    }

    public async Task<CartGetDTO> DeleteAsync(int id)
    {
        await cartItemRepository.DeleteAsync(id);
        return await GetAllAsync();
    }

    public async Task DeleteAllAsync()
    {
        await cartItemRepository.DeleteAllAsync();
    }

    private static decimal CalculateDiscount(Promotion promo, List<CartItem> cartItems, decimal cartTotal)
    {
        List<CartItem> applicable;
        if (promo.ProductId.HasValue)
        {
            var item = cartItems.FirstOrDefault(i => i.ProductId == promo.ProductId.Value);
            applicable = item is null ? [] : [item];
        }
        else if (promo.CategoryId.HasValue)
        {
            applicable = cartItems
                .Where(i => i.Product.Categories.Any(c => c.Id == promo.CategoryId.Value))
                .ToList();
        }
        else
        {
            applicable = cartItems;
        }

        if (applicable.Count == 0) return 0;

        var applicableTotal = applicable.Sum(i => i.Product.Price * i.Quantity);
        var applicableQuantity = applicable.Sum(i => i.Quantity);

        var triggered = promo.Type switch
        {
            PromotionType.Quantity => applicableQuantity >= promo.Threshold,
            PromotionType.CartTotal => applicableTotal >= promo.Threshold,
            _ => false
        };

        if (!triggered) return 0;

        return promo.Reward switch
        {
            PromotionReward.PercentDiscount => applicableTotal * promo.RewardValue / 100m,
            PromotionReward.FreeItems when promo.ProductId.HasValue =>
                Math.Min(promo.RewardValue, applicable[0].Quantity) * applicable[0].Product.Price,
            PromotionReward.FreeItems =>
                applicable
                    .SelectMany(i => Enumerable.Repeat(i.Product.Price, i.Quantity))
                    .OrderBy(p => p)
                    .Take(promo.RewardValue)
                    .Sum(),
            _ => 0
        };
    }

    private static CartItemGetDTO MapToDTO(CartItem cartItem) => new()
    {
        Id = cartItem.Id,
        ProductId = cartItem.ProductId,
        ProductName = cartItem.Product.Name,
        Price = cartItem.Product.Price,
        Quantity = cartItem.Quantity,
        Subtotal = cartItem.Product.Price * cartItem.Quantity
    };
}
