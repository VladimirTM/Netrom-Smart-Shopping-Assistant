namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class PromotionGetDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public PromotionTypeDTO Type { get; set; } = null!;
    public decimal Threshold { get; set; }
    public PromotionRewardDTO Reward { get; set; } = null!;
    public int RewardValue { get; set; }
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }
    public bool IsActive { get; set; }
}