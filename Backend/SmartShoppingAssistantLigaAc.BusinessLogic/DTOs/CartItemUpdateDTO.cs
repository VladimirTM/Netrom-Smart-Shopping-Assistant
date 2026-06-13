using System.ComponentModel.DataAnnotations;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class CartItemUpdateDTO
{
    [Required]
    [Range(1, 1000)]
    public int Quantity { get; set; }
}
