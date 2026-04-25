namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
}