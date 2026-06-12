using System.ComponentModel.DataAnnotations;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class OrderItemGetDTO
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}

public class OrderGetDTO
{
    public int Id { get; set; }
    public List<OrderItemGetDTO> Items { get; set; } = [];
    public decimal Total { get; set; }
    public string Status { get; set; } = null!;
    public DateTime PlacedAt { get; set; }

    public string ShippingName { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
}

public class AdminOrderGetDTO : OrderGetDTO
{
    public string UserEmail { get; set; } = null!;
}

public class ShippingAddressDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Address { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string City { get; set; } = null!;

    [Required]
    [StringLength(20, MinimumLength = 1)]
    public string PostalCode { get; set; } = null!;

    [Required]
    [Phone]
    [StringLength(30, MinimumLength = 1)]
    public string Phone { get; set; } = null!;
}

public class PlaceOrderRequest
{
    [Required]
    public ShippingAddressDto ShippingAddress { get; set; } = null!;
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = null!;
}
