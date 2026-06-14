namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class AnalyticsSummaryDTO
{
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<TopProductDTO> TopProducts { get; set; } = [];
    public List<PromotionUsageDTO> PromotionUsage { get; set; } = [];
}

public class TopProductDTO
{
    public int ProductId { get; set; }
    public string Name { get; set; } = null!;
    public int UnitsSold { get; set; }
}

public class PromotionUsageDTO
{
    public int PromotionId { get; set; }
    public string Name { get; set; } = null!;
    public int UsageCount { get; set; }
}
