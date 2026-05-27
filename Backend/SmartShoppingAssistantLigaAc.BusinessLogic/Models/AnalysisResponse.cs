using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Models;

[Description("Cart analysis result with product suggestions")]
public sealed class AnalysisResponse
{
    [Description("A brief overall summary of the cart analysis and what the suggestions aim to achieve")]
    [JsonPropertyName("summary")]
    public string Summary { get; set; } = "";

    [Description("Up to 5 product suggestions for the user to add to their cart")]
    [JsonPropertyName("suggestions")]
    public List<Suggestion> Suggestions { get; set; } = [];
}

[Description("A single product suggestion")]
public sealed class Suggestion
{
    [Description("The unique ID of the suggested product")]
    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [Description("The display name of the suggested product")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [Description("The price per unit of the suggested product in RON")]
    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [Description("The recommended quantity the user should add; set to nearMissDelta for Quantity near-miss deals, otherwise defaults to 1")]
    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }

    [Description("Brief explanation of why this product is being suggested, referencing any promotion it would help unlock")]
    [JsonPropertyName("reason")]
    public string Reason { get; set; } = "";

    [Description("Product image URL copied exactly from the SearchProductsByCategory tool result. Null if not available.")]
    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }

    [Description("The estimated monetary savings in RON the user would gain by adding this product to unlock a promotion. Null if this suggestion does not unlock a promotion.")]
    [JsonPropertyName("savings")]
    public decimal? Savings { get; set; }
}