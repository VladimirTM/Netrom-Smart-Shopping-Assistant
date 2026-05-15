using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Models;

[Description("Cart analysis result with product suggestions")]
public sealed class AnalysisResponse
{
    [JsonPropertyName("summary")]
    public string Summary { get; set; } = "";

    [JsonPropertyName("suggestions")]
    public List<Suggestion> Suggestions { get; set; } = [];
}

public sealed class Suggestion
{
    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }

    [JsonPropertyName("reason")]
    public string Reason { get; set; } = "";

    [JsonPropertyName("savings")]
    public decimal? Savings { get; set; }
}