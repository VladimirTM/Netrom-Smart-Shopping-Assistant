namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class PromotionUpdateDTO
{
    public string Name { get; set; } = null!;
    public int Type { get; set; }
    public decimal Threshold { get; set; }
    public int Reward { get; set; }
    public int RewardValue { get; set; }
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }
    public bool IsActive { get; set; }
}

