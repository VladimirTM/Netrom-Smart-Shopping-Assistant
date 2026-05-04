namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class CartGetDTO
{
    public List<CartItemGetDTO> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public decimal PromotionsValue { get; set; }
    public decimal TotalAfterPromotions { get; set; }
}
