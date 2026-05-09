using System.ComponentModel;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Tools;

public static class ShoppingTools
{
    [Description("Get all active promotions that apply to a specific product (by product ID or its category).")]
    public static async Task<List<PromotionGetDTO>> GetPromotionsForProduct(
        [Description("The product ID to check")] int productId,
        IPromotionService promotionService)
    {
        return await promotionService.GetForProductAsync(productId);
    }
}