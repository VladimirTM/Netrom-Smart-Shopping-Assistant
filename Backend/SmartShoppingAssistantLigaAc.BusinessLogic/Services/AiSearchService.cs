using System.Text.Json;
using Microsoft.Extensions.AI;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class AiSearchService(
    IChatClient chatClient,
    IProductService productService,
    IRepository<Category> categoryRepository) : IAiSearchService
{
    public async Task<List<ProductGetDTO>> SearchAsync(string query)
    {
        var categories = await categoryRepository.GetAllAsync();
        var categoryJson = JsonSerializer.Serialize(categories.Select(c => new { c.Id, c.Name }));

        var prompt = $"""
            You are a product search assistant. Extract structured search filters from the user's natural language query.

            Available product categories (use only these IDs):
            {categoryJson}

            User query: "{query}"

            Rules:
            - keywords: extract meaningful product keywords from the query (ignore stop words)
            - categoryIds: map to matching category IDs from the list above (empty if none match)
            - minPrice: minimum price in RON if mentioned, otherwise 0
            - maxPrice: maximum price in RON if mentioned, otherwise 0 (0 = no upper limit)
            """;

        var response = await chatClient.GetResponseAsync(
            [new ChatMessage(ChatRole.User, prompt)],
            new ChatOptions { ResponseFormat = ChatResponseFormat.ForJsonSchema<SearchFilters>() });

        SearchFilters? filters = null;
        try
        {
            filters = JsonSerializer.Deserialize<SearchFilters>(response.Text ?? "{}");
        }
        catch (JsonException) { }

        if (filters is null || (filters.Keywords.Count == 0 && filters.CategoryIds.Count == 0 && filters.MinPrice == 0 && filters.MaxPrice == 0))
            return [];

        var allProducts = await productService.GetAllAsync();

        return allProducts.Where(p => MatchesFilters(p, filters)).ToList();
    }

    private static bool MatchesFilters(ProductGetDTO p, SearchFilters filters)
    {
        if (filters.MinPrice > 0 && p.Price < filters.MinPrice) return false;
        if (filters.MaxPrice > 0 && p.Price > filters.MaxPrice) return false;

        if (filters.CategoryIds.Count > 0 && !p.Categories.Any(c => filters.CategoryIds.Contains(c.Id)))
            return false;

        if (filters.Keywords.Count > 0 &&
            !filters.Keywords.Any(kw =>
                p.Name.Contains(kw, StringComparison.OrdinalIgnoreCase) ||
                (p.Description ?? "").Contains(kw, StringComparison.OrdinalIgnoreCase)))
            return false;

        return true;
    }
}
