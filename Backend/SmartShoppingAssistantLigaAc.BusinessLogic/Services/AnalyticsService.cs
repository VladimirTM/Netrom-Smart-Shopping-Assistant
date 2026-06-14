using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class AnalyticsService(SmartShoppingAssistantDbContext context) : IAnalyticsService
{
    public async Task<AnalyticsSummaryDTO> GetSummaryAsync()
    {
        var totalOrders = await context.Orders.CountAsync();

        var totalRevenue = await context.Orders.SumAsync(o => (decimal?)o.Total) ?? 0;

        var topProducts = await context.OrderItems
            .GroupBy(i => new { i.ProductId, i.ProductName })
            .Select(g => new TopProductDTO
            {
                ProductId = g.Key.ProductId,
                Name = g.Key.ProductName,
                UnitsSold = g.Sum(i => i.Quantity)
            })
            .OrderByDescending(p => p.UnitsSold)
            .Take(5)
            .ToListAsync();

        var promotions = await context.Promotions
            .Where(p => p.IsActive)
            .ToListAsync();

        var promotionUsage = promotions.Select(p => new PromotionUsageDTO
        {
            PromotionId = p.Id,
            Name = p.Name,
            UsageCount = 0
        }).ToList();

        return new AnalyticsSummaryDTO
        {
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            TopProducts = topProducts,
            PromotionUsage = promotionUsage
        };
    }

}
