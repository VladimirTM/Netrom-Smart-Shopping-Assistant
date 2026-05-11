using System.ComponentModel;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.BusinessLogic.Tools;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

public class SuggestionComposerAgent(IChatClient chatClient, IProductService productService) : ISuggestionComposerAgent
{
    public ChatClientAgent Build(string cartJson, string categoriesJson, string promotionAnalysisJson)
    {
        return new ChatClientAgent(
            chatClient,
            new ChatClientAgentOptions
            {
                Name = "SuggestionComposer",
                Description = "Composes product suggestions based on cart, categories, and promotion analysis",
                ChatOptions = new ChatOptions
                {
                    Instructions = $"""
                                    You are a smart shopping suggestion assistant.

                                    Current cart:
                                    {cartJson}

                                    Available categories:
                                    {categoriesJson}

                                    Promotion analysis (active and near-miss deals):
                                    {promotionAnalysisJson}

                                    1. Call SearchProductsByCategory for relevant categories to discover available products.
                                    2. Suggest products relevant to what the user already has in their cart.
                                    3. Prioritize products that would help the user activate near-miss promotions from the analysis.
                                    4. Do not suggest products already present in the cart.
                                    5. Return at most 5 suggestions.
                                    """,
                    ResponseFormat = ChatResponseFormat.ForJsonSchema<SuggestionAnalysis>(),
                    Tools =
                    [
                        AIFunctionFactory.Create(
                            ([Description("The category ID to search products in")] int categoryId) =>
                                ShoppingTools.SearchProductsByCategory(categoryId, productService),
                            "SearchProductsByCategory",
                            "Search for all products available in a specific category."
                        )
                    ]
                }
            },
            null!,
            null!
        );
    }
}
