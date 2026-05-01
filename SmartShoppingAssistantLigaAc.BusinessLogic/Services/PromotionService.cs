using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class PromotionService(IRepository<Promotion> promotionRepository) : IPromotionService
{
    public async Task<List<PromotionGetDTO>> GetAllAsync()
    {
        var promotions = await promotionRepository.GetAllAsync();
        
        return promotions.Select(MapToDTO).ToList();
    }

    public async Task<PromotionGetDTO> GetByIdAsync(int id)
    {
        var promotion = await promotionRepository.GetByIdAsync(id);
        
        return MapToDTO(promotion);
    }

    public async Task<PromotionGetDTO> CreateAsync(PromotionCreateDTO dto)
    {
        var promotion = new Promotion
        {
            Name = dto.Name,
            Type = (PromotionType)dto.Type,
            Threshold = dto.Threshold,
            Reward = (PromotionReward)dto.Reward,
            RewardValue = dto.RewardValue,
            ProductId = dto.ProductId,
            CategoryId = dto.CategoryId,
            IsActive = dto.IsActive
        };
        
        var created = await promotionRepository.AddAsync(promotion);
        return MapToDTO(created);
    }

    public async Task<PromotionGetDTO> UpdateAsync(int id, PromotionUpdateDTO dto)
    {
        var promotion = await promotionRepository.GetByIdAsync(id);
        
        promotion.Name = dto.Name;
        promotion.Type = (PromotionType)dto.Type;
        promotion.Threshold = dto.Threshold;
        promotion.Reward = (PromotionReward)dto.Reward;
        promotion.RewardValue = dto.RewardValue;
        promotion.ProductId = dto.ProductId;
        promotion.CategoryId = dto.CategoryId;
        promotion.IsActive = dto.IsActive;
        
        var updated = await promotionRepository.UpdateAsync(promotion);
        return MapToDTO(updated);
    }

    public async Task DeleteAsync(int id)
    { 
        await promotionRepository.DeleteAsync(id);
    }
    
    private static PromotionTypeDTO MapPromotionTypeToDTO(PromotionType type) => type switch
    {
        PromotionType.Quantity => new PromotionTypeDTO
        {
            Value = 0,
            Name = "Quantity",
            Description = "Number of items (of a product/category) in the cart"
        },
        PromotionType.CartTotal => new PromotionTypeDTO
        {
            Value = 1,
            Name = "CartTotal",
            Description = "Total price of the cart (or category subset) in RON"
        },
        _ => throw new ArgumentException($"Unknown promotion type: {type}")
    };
    
    private static PromotionRewardDTO MapPromotionRewardToDTO(PromotionReward reward) => reward switch
    {
        PromotionReward.FreeItems => new PromotionRewardDTO
        {
            Value = 0,
            Name = "FreeItems",
            Description = "N items for free"
        },
        PromotionReward.PercentDiscount => new PromotionRewardDTO
        {
            Value = 1,
            Name = "PercentDiscount",
            Description = "N% off"
        },
        _ => throw new ArgumentException($"Unknown promotion reward: {reward}")
    };
    
    private static PromotionGetDTO MapToDTO(Promotion promotion) => new()
    {
        Id = promotion.Id,
        Name = promotion.Name,
        Type = MapPromotionTypeToDTO(promotion.Type),
        Threshold = promotion.Threshold,
        Reward = MapPromotionRewardToDTO(promotion.Reward),
        RewardValue = promotion.RewardValue,
        ProductId = promotion.ProductId,
        CategoryId = promotion.CategoryId,
        IsActive = promotion.IsActive
    };
}