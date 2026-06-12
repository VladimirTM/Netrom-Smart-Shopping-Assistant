using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/orders")]
[ApiController]
[Authorize]
public class OrderController(IOrderService orderService) : ControllerBase
{
    private int? UserId => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpPost]
    public async Task<ActionResult<OrderGetDTO>> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        if (UserId is not { } userId) return Unauthorized();
        try
        {
            var order = await orderService.PlaceOrderAsync(userId, request.ShippingAddress);
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderGetDTO>>> GetOrders()
    {
        if (UserId is not { } userId) return Unauthorized();
        var orders = await orderService.GetOrdersAsync(userId);
        return Ok(orders);
    }
}
