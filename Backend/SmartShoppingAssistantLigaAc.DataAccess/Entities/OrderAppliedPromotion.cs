namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class OrderAppliedPromotion
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int PromotionId { get; set; }
    public Promotion Promotion { get; set; } = null!;
    public decimal Discount { get; set; }
}
