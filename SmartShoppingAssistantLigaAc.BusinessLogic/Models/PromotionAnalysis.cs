using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Models;

[Description("Promotion analysis for the current cart")]
public sealed class PromotionAnalysis
{
    [JsonPropertyName("activeDeals")]
    public List<Deal> ActiveDeals { get; set; } = [];

    [JsonPropertyName("nearMissDeals")]
    public List<Deal> NearMissDeals { get; set; } = [];
}

public sealed class Deal
{
    [JsonPropertyName("promotionId")]
    public int PromotionId { get; set; }

    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = "";

    [JsonPropertyName("action")]
    public string? Action { get; set; }

    [JsonPropertyName("savings")]
    public decimal? Savings { get; set; }
}