using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Models;

[Description("Search filters extracted from a natural language query")]
public sealed class SearchFilters
{
    [Description("Keywords to match against product names and descriptions")]
    [JsonPropertyName("keywords")]
    public List<string> Keywords { get; set; } = [];

    [Description("IDs of categories that match the user's request")]
    [JsonPropertyName("categoryIds")]
    public List<int> CategoryIds { get; set; } = [];

    [Description("Minimum price in RON, or 0 if not specified")]
    [JsonPropertyName("minPrice")]
    public decimal MinPrice { get; set; }

    [Description("Maximum price in RON, or 0 if not specified (0 means no upper limit)")]
    [JsonPropertyName("maxPrice")]
    public decimal MaxPrice { get; set; }
}
