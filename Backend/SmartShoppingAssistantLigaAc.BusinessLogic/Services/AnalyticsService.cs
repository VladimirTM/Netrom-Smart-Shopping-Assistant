using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class AnalyticsService(SmartShoppingAssistantDbContext context) : IAnalyticsService
{
    public async Task<AnalyticsSummaryDTO> GetSummaryAsync()
    {
        var totalCarts = await context.CartItems
            .Select(c => c.UserId)
            .Distinct()
            .CountAsync();

        var estimatedRevenue = await context.CartItems
            .Include(c => c.Product)
            .SumAsync(c => c.Quantity * c.Product.Price);

        var topProducts = await context.CartItems
            .Include(c => c.Product)
            .GroupBy(c => new { c.ProductId, c.Product.Name })
            .Select(g => new TopProductDTO
            {
                ProductId = g.Key.ProductId,
                Name = g.Key.Name,
                CartAdditions = g.Sum(c => c.Quantity)
            })
            .OrderByDescending(p => p.CartAdditions)
            .Take(5)
            .ToListAsync();

        var promotions = await context.Promotions
            .Where(p => p.IsActive)
            .ToListAsync();

        var allCartItems = await context.CartItems
            .Include(c => c.Product)
            .ThenInclude(p => p.Categories)
            .ToListAsync();

        var userCarts = allCartItems
            .GroupBy(c => c.UserId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var promotionUsage = promotions.Select(p => new PromotionUsageDTO
        {
            PromotionId = p.Id,
            Name = p.Name,
            UsageCount = userCarts.Count(kv =>
                CalculateDiscount(p, kv.Value, kv.Value.Sum(i => i.Product.Price * i.Quantity)) > 0)
        }).ToList();

        return new AnalyticsSummaryDTO
        {
            TotalCarts = totalCarts,
            EstimatedRevenue = estimatedRevenue,
            TopProducts = topProducts,
            PromotionUsage = promotionUsage
        };
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
}
