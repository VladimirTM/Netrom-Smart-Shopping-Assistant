using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class PromotionCreateDTO
{
    public string Name { get; set; } = null!;
    public PromotionType Type { get; set; }
    public decimal Threshold { get; set; }
    public PromotionReward Reward { get; set; }
    public int RewardValue { get; set; }
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }
    public bool IsActive { get; set; }
}
