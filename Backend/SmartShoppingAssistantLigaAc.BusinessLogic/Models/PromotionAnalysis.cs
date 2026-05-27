using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Models;

[Description("Promotion analysis for the current cart")]
public sealed class PromotionAnalysis
{
    [Description("List of promotions the user has already activated with the current cart")]
    [JsonPropertyName("activeDeals")]
    public List<Deal> ActiveDeals { get; set; } = [];

    [Description("List of promotions the user is close to activating but has not yet reached the threshold")]
    [JsonPropertyName("nearMissDeals")]
    public List<Deal> NearMissDeals { get; set; } = [];
}

[Description("A single promotion deal, either active or near-miss")]
public sealed class Deal
{
    [Description("The unique ID of the promotion")]
    [JsonPropertyName("promotionId")]
    public int PromotionId { get; set; }

    [Description("The display name of the promotion, e.g. 'Buy 5 Get 1 Free Spaghetti'")]
    [JsonPropertyName("promotionName")]
    public string PromotionName { get; set; } = "";

    [Description("The product ID this promotion applies to; null if the promotion is category-wide or cart-wide")]
    [JsonPropertyName("productId")]
    public int? ProductId { get; set; }

    [Description("The category ID this promotion applies to; null if product-specific or cart-wide")]
    [JsonPropertyName("categoryId")]
    public int? CategoryId { get; set; }

    [Description("Human-readable description of what this deal gives, e.g. 'Buy 5 Spaghetti and get 1 free'")]
    [JsonPropertyName("description")]
    public string Description { get; set; } = "";

    [Description("Human-readable action the user should take to activate this deal, e.g. 'Add 1 more Banana'. Only set for near-miss deals.")]
    [JsonPropertyName("action")]
    public string? Action { get; set; }

    [Description("For near-miss deals: units or RON still needed to reach threshold. For Quantity promotions: whole number. For CartTotal: decimal to 2 places. Null for active deals.")]
    [JsonPropertyName("nearMissDelta")]
    public decimal? NearMissDelta { get; set; }

    [Description("The estimated monetary savings in RON the user receives (active deals) or would receive (near-miss deals) when this promotion is triggered")]
    [JsonPropertyName("savings")]
    public decimal? Savings { get; set; }
}