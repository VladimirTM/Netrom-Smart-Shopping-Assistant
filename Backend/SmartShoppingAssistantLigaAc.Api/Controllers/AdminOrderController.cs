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
        try
        {
            await orderService.UpdateOrderStatusAsync(id, request.Status);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
