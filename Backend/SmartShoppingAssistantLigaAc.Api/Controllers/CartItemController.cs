using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/cart")]
[ApiController]
[Authorize]
public class CartItemController(ICartItemService cartItemService) : ControllerBase
{
    private int? UserId => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<CartGetDTO>> GetAll()
    {
        if (UserId is not { } userId) return Unauthorized();
        var cart = await cartItemService.GetAllAsync(userId);
        return Ok(cart);
    }

    [HttpGet("items/{id}")]
    public async Task<ActionResult<CartItemGetDTO>> GetById(int id)
    {
        if (UserId is not { } userId) return Unauthorized();
        try
        {
            var cartItem = await cartItemService.GetByIdAsync(id, userId);
            return Ok(cartItem);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartGetDTO>> Create([FromBody] CartItemCreateDTO dto)
    {
        if (UserId is not { } userId) return Unauthorized();
        var cart = await cartItemService.CreateAsync(dto, userId);
        return Ok(cart);
    }

    [HttpPut("items/{id}")]
    public async Task<ActionResult<CartGetDTO>> Update(int id, [FromBody] CartItemUpdateDTO dto)
    {
        if (UserId is not { } userId) return Unauthorized();
        try
        {
            var cart = await cartItemService.UpdateAsync(id, dto, userId);
            return Ok(cart);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("items/{id}")]
    public async Task<ActionResult<CartGetDTO>> Delete(int id)
    {
        if (UserId is not { } userId) return Unauthorized();
        try
        {
            var cart = await cartItemService.DeleteAsync(id, userId);
            return Ok(cart);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAll()
    {
        if (UserId is not { } userId) return Unauthorized();
        await cartItemService.DeleteAllAsync(userId);
        return NoContent();
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> AnalyzeCart()
    {
        if (UserId is not { } userId) return Unauthorized();
        var analysisResponse = await cartItemService.AnalyzeCartAsync(userId);
        return Ok(analysisResponse);
    }
}
