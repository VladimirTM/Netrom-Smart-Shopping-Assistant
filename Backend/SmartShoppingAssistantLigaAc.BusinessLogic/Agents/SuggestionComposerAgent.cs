using System.ComponentModel;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.BusinessLogic.Tools;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

public sealed class SuggestionComposerAgent(IChatClient chatClient, IProductService productService, ILoggerFactory loggerFactory, IServiceProvider services) : ISuggestionComposerAgent
{
    public ChatClientAgent Build(string cartJson, string categoriesJson)
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
                                    You are a smart shopping suggestion assistant. You will receive cart data and a promotion analysis from the previous agent.

                                    Current cart:
                                    {cartJson}

                                    Available categories:
                                    {categoriesJson}

                                    1. Review the nearMissDeals from the promotion analysis passed to you — each near-miss deal has a nearMissDelta field indicating exactly how much more quantity or cart value is needed.
                                    2. Call SearchProductsByCategory for relevant categories to discover available products. For near-miss deals that have a categoryId, call SearchProductsByCategory(categoryId). For product-specific near-miss deals, use the product's category from the cart data.
                                    3. Prioritize suggestions that activate near-miss promotions:
                                       - Quantity-based near-miss: set the suggestion's quantity to the nearMissDelta value (the exact number of units still needed).
                                       - CartTotal-based near-miss: suggest products whose (price * quantity) is close to the nearMissDelta value.
                                    4. Fill any remaining suggestion slots with complementary products relevant to the cart's categories.
                                    5. Do not suggest products already present in the cart.
                                    6. Return at most 5 suggestions.
                                    7. For each suggestion, populate from the SearchProductsByCategory tool results:
                                       - productId: the product's Id
                                       - name: the product's Name
                                       - price: the product's Price
                                       - imageUrl: the product's ImageUrl (copy exactly as returned; use null if absent)
                                       - quantity: as described in step 3 (default to 1 for complementary suggestions)
                                       - reason: brief explanation referencing the specific promotion name if applicable
                                       - savings: estimated discount in RON if this suggestion activates a promotion; must be null (not 0) if it does not
                                    8. Include a brief summary of the overall cart analysis and what the suggestions aim to achieve.
                                    """,
                    ResponseFormat = ChatResponseFormat.ForJsonSchema<AnalysisResponse>(),
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
            loggerFactory,
            services
        );
    }
}
