using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IOrderService
{
    Task<OrderGetDTO> PlaceOrderAsync(int userId, ShippingAddressDto shippingAddress);
    Task<List<OrderGetDTO>> GetOrdersAsync(int userId);
    Task<List<AdminOrderGetDTO>> GetAllOrdersAsync();
    Task UpdateOrderStatusAsync(int id, string status);
}
