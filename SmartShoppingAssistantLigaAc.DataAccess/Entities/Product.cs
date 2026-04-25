namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
}