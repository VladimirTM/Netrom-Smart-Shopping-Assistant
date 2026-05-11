using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Models;

[Description("Product suggestions based on cart content and promotions")]
public sealed class SuggestionAnalysis
{
    [JsonPropertyName("suggestions")]
    public List<Suggestion> Suggestions { get; set; } = [];
}

public sealed class Suggestion
{
    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [JsonPropertyName("productName")]
    public string ProductName { get; set; } = "";

    [JsonPropertyName("reason")]
    public string Reason { get; set; } = "";

    [JsonPropertyName("promotionContext")]
    public string? PromotionContext { get; set; }
}
