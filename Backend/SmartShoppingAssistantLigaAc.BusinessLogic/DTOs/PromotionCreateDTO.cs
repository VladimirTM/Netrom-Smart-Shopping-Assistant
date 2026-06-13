using System.ComponentModel.DataAnnotations;
using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class PromotionCreateDTO
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [Required]
    public PromotionType Type { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Threshold { get; set; }

    [Required]
    public PromotionReward Reward { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int RewardValue { get; set; }

    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }
    public bool IsActive { get; set; }
}
