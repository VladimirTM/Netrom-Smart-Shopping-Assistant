namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class WishlistItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }

    public Product Product { get; set; } = null!;
    public User User { get; set; } = null!;
}
