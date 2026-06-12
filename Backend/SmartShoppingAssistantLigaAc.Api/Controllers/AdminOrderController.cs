using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/admin/orders")]
[ApiController]
[Authorize(Roles = "admin")]
public class AdminOrderController(IOrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AdminOrderGetDTO>>> GetAllOrders()
    {
        var orders = await orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var allowed = new[] { "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled" };
        if (!allowed.Contains(request.Status))
            return BadRequest($"Invalid status. Allowed: {string.Join(", ", allowed)}");

        try
        {
            await orderService.UpdateOrderStatusAsync(id, request.Status);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
