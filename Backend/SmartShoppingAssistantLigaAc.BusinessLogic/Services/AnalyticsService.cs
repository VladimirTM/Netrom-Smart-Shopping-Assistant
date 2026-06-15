using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class AnalyticsService(SmartShoppingAssistantDbContext context) : IAnalyticsService
{
    public async Task<AnalyticsSummaryDTO> GetSummaryAsync()
    {
        var countedOrders = context.Orders
            .Where(o => o.Status != "Pending" && o.Status != "Cancelled");

        var totalOrders = await countedOrders.CountAsync();

        var totalRevenue = await countedOrders.SumAsync(o => (decimal?)o.Total) ?? 0;

        var topProducts = await context.OrderItems
            .Where(i => i.Order.Status != "Pending" && i.Order.Status != "Cancelled")
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

        var promotionUsage = await context.Promotions
            .Where(p => p.IsActive)
            .Select(p => new PromotionUsageDTO
            {
                PromotionId = p.Id,
                Name = p.Name,
                UsageCount = p.OrderUsages.Count(oap =>
                    oap.Order.Status != "Pending" && oap.Order.Status != "Cancelled")
            })
            .ToListAsync();

        return new AnalyticsSummaryDTO
        {
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            TopProducts = topProducts,
            PromotionUsage = promotionUsage
        };
    }

}
