using System.ComponentModel;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.BusinessLogic.Tools;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

public sealed class PromotionCheckerAgent(IChatClient chatClient, IPromotionService promotionService) : IPromotionCheckerAgent
{
    public ChatClientAgent Build(string cartJson)
    {
        return new ChatClientAgent(
            chatClient,
            new ChatClientAgentOptions
            {
                Name = "PromotionChecker",
                Description = "Checks promotions for cart items",
                ChatOptions = new ChatOptions
                {
                    Instructions = $"""
                                    You are a promotion analysis agent. Here is the current cart:
                                    {cartJson}

                                    For each product in the cart:
                                    1. Call GetPromotionsForProduct(productId) to retrieve all active promotions.

                                    2. Classify each promotion as ACTIVE or NEAR-MISS:
                                       - Quantity promotions: sum cart quantity for items in the promotion scope (product-specific, category-wide, or cart-wide).
                                         ACTIVE: currentQuantity >= threshold
                                         NEAR-MISS: currentQuantity < threshold AND (threshold - currentQuantity) <= 1
                                       - CartTotal promotions: sum (price * quantity) for items in the promotion scope.
                                         ACTIVE: currentTotal >= threshold
                                         NEAR-MISS: currentTotal < threshold AND (threshold - currentTotal) <= (threshold * 0.20)

                                    3. For each ACTIVE deal, populate:
                                       - promotionId: promotion.Id
                                       - promotionName: promotion.Name
                                       - productId: promotion.ProductId (null if category-based or cart-wide)
                                       - categoryId: promotion.CategoryId (null if product-specific or cart-wide)
                                       - description: human-readable description of what the deal gives
                                       - action: null
                                       - nearMissDelta: null
                                       - savings: estimated monetary discount in RON

                                    4. For each NEAR-MISS deal, populate:
                                       - promotionId: promotion.Id
                                       - promotionName: promotion.Name
                                       - productId: promotion.ProductId (null if category-based or cart-wide)
                                       - categoryId: promotion.CategoryId (null if product-specific or cart-wide)
                                       - description: human-readable description of what the deal gives
                                       - action: human-readable instruction, e.g. "Add 1 more Banana" or "Spend 12.50 RON more"
                                       - nearMissDelta: (threshold - currentQuantity) for Quantity; (threshold - currentTotal) rounded to 2 decimal places for CartTotal
                                       - savings: estimated discount once the threshold is met

                                    5. Each promotion must appear at most once across activeDeals and nearMissDeals.
                                    """,
                    ResponseFormat = ChatResponseFormat.ForJsonSchema<PromotionAnalysis>(),
                    Tools =
                    [
                        AIFunctionFactory.Create(
                            ([Description("The product ID to check")] int productId) =>
                                ShoppingTools.GetPromotionsForProduct(productId, promotionService),
                            "GetPromotionsForProduct",
                            "Get all active promotions that apply to a specific product (by product ID or its category)."
                        )
                    ]
                }
            },
            null!,
            null!
        );
    }
}