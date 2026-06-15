namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public List<OrderItem> Items { get; set; } = [];
    public List<OrderAppliedPromotion> AppliedPromotions { get; set; } = [];
    public decimal Total { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime PlacedAt { get; set; } = DateTime.UtcNow;

    public string ShippingName { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
}
