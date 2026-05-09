using System.ComponentModel;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using SmartShoppingAssistantLigaAc.BusinessLogic.Models;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.BusinessLogic.Tools;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

public class PromotionCheckerAgent(IChatClient chatClient, IPromotionService promotionService) : IPromotionCheckerAgent
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
                                    You check promotions. Here is the current cart:
                                    {cartJson}

                                    1. Call GetPromotionsForProduct for each product in the cart.
                                    2. Compare each promotion's rules against the cart quantities/totals.
                                    3. For near-miss deals, calculate the savings the user would get.
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