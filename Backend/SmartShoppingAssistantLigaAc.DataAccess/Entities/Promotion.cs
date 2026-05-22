using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

namespace SmartShoppingAssistantLigaAc.DataAccess.Entities;

public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public PromotionType Type { get; set; }
    public decimal Threshold { get; set; }
    public PromotionReward Reward { get; set; }
    public int RewardValue { get; set; }
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }
    public bool IsActive { get; set; }

    public Product? Product { get; set; }
    public Category? Category { get; set; }
}
