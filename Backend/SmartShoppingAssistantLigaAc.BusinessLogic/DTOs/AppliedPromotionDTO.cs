namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class AppliedPromotionDTO
{
    public int PromotionId { get; set; }
    public string PromotionName { get; set; } = null!;
    public decimal Discount { get; set; }
}
