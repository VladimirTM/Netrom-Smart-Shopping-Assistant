using System.ComponentModel.DataAnnotations;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class CategoryUpdateDTO
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }
}