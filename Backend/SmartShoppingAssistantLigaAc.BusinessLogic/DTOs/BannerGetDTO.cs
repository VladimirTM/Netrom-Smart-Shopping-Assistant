namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class BannerGetDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkTo { get; set; }
    public int? PromotionId { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}
