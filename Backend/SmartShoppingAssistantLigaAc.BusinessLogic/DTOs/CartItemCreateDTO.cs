using System.ComponentModel.DataAnnotations;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class CartItemCreateDTO
{
    [Required]
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Required]
    [Range(1, 1000)]
    public int Quantity { get; set; }
}
