namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class ProductGetDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
}