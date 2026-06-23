namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "user";
    public string? DisplayName { get; set; }
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CartItem> CartItems { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
    public ICollection<WishlistItem> WishlistItems { get; set; } = [];
}
