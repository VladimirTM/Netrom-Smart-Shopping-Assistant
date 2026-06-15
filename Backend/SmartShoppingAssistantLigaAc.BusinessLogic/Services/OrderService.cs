using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class OrderService(
    IOrderRepository orderRepository,
    ICartItemRepository cartItemRepository,
    ICartItemService cartItemService,
    IProductRepository productRepository) : IOrderService
{
    public async Task<OrderGetDTO> PlaceOrderAsync(int userId, ShippingAddressDto shippingAddress)
    {
        var cartItems = await cartItemRepository.GetAllWithProductAndCategoriesAsync(userId);
        if (cartItems.Count == 0)
            throw new InvalidOperationException("Cart is empty.");

        foreach (var item in cartItems)
        {
            if (item.Product.StockQuantity < item.Quantity)
                throw new InvalidOperationException(
                    $"Insufficient stock for '{item.Product.Name}'. Available: {item.Product.StockQuantity}, requested: {item.Quantity}.");
        }

        var cartDto = await cartItemService.GetAllAsync(userId);

        var order = new Order
        {
            UserId = userId,
            PlacedAt = DateTime.UtcNow,
            Status = "Pending",
            ShippingName = shippingAddress.Name,
            ShippingAddress = shippingAddress.Address,
            ShippingCity = shippingAddress.City,
            ShippingPostalCode = shippingAddress.PostalCode,
            ShippingPhone = shippingAddress.Phone,
            Items = cartItems.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Price = i.Product.Price,
                Quantity = i.Quantity,
                Subtotal = i.Product.Price * i.Quantity
            }).ToList(),
            AppliedPromotions = cartDto.AppliedPromotions.Select(p => new OrderAppliedPromotion
            {
                PromotionId = p.PromotionId,
                Discount = p.Discount
            }).ToList()
        };

        order.Total = cartDto.Total;

        foreach (var item in cartItems)
        {
            item.Product.StockQuantity -= item.Quantity;
            await productRepository.UpdateAsync(item.Product);
        }

        await orderRepository.AddAsync(order);
        await cartItemRepository.DeleteAllForUserAsync(userId);

        return MapToDTO(order);
    }

    public async Task<List<OrderGetDTO>> GetOrdersAsync(int userId)
    {
        var orders = await orderRepository.GetByUserIdAsync(userId);
        return orders.Select(MapToDTO).ToList();
    }

    public async Task<List<AdminOrderGetDTO>> GetAllOrdersAsync()
    {
        var orders = await orderRepository.GetAllAsync();
        return orders.Select(o => new AdminOrderGetDTO
        {
            Id = o.Id,
            Total = o.Total,
            Status = o.Status,
            PlacedAt = o.PlacedAt,
            ShippingName = o.ShippingName,
            ShippingAddress = o.ShippingAddress,
            ShippingCity = o.ShippingCity,
            ShippingPostalCode = o.ShippingPostalCode,
            ShippingPhone = o.ShippingPhone,
            UserEmail = o.User.Email,
            Items = o.Items.Select(i => new OrderItemGetDTO
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Price = i.Price,
                Quantity = i.Quantity,
                Subtotal = i.Subtotal
            }).ToList()
        }).ToList();
    }

    public async Task UpdateOrderStatusAsync(int id, string status)
    {
        await orderRepository.UpdateStatusAsync(id, status);
    }

    private static OrderGetDTO MapToDTO(Order order) => new()
    {
        Id = order.Id,
        Total = order.Total,
        Status = order.Status,
        PlacedAt = order.PlacedAt,
        ShippingName = order.ShippingName,
        ShippingAddress = order.ShippingAddress,
        ShippingCity = order.ShippingCity,
        ShippingPostalCode = order.ShippingPostalCode,
        ShippingPhone = order.ShippingPhone,
        Items = order.Items.Select(i => new OrderItemGetDTO
        {
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            Price = i.Price,
            Quantity = i.Quantity,
            Subtotal = i.Subtotal
        }).ToList()
    };
}
