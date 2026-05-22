namespace SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

public enum PromotionType       // What triggers the promo?
{
    Quantity = 0,               // Number of items (of a product/category) in the cart
    CartTotal = 1               // Total price of the cart (or category subset) in RON
}
