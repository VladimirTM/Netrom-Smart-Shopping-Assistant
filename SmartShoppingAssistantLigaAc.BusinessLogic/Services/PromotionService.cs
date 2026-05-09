using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class PromotionService(IRepository<Promotion> promotionRepository) : IPromotionService
{
    public async Task<List<PromotionGetDTO>> GetAllAsync(bool activeOnly = false)
    {
        var promotions = await promotionRepository.GetAllAsync();

        if (activeOnly)
            promotions = promotions.Where(p => p.IsActive).ToList();

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
            Type = dto.Type,
            Threshold = dto.Threshold,
            Reward = dto.Reward,
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
        promotion.Type = dto.Type;
        promotion.Threshold = dto.Threshold;
        promotion.Reward = dto.Reward;
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

    private static PromotionGetDTO MapToDTO(Promotion promotion) => new()
    {
        Id = promotion.Id,
        Name = promotion.Name,
        Type = promotion.Type,
        Threshold = promotion.Threshold,
        Reward = promotion.Reward,
        RewardValue = promotion.RewardValue,
        ProductId = promotion.ProductId,
        CategoryId = promotion.CategoryId,
        IsActive = promotion.IsActive
    };
}
