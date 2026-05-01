using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/cart")]
[ApiController]
public class CartItemController(ICartItemService cartItemService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CartItemGetDTO>>> GetAll()
    {
        var cartItems = await cartItemService.GetAllAsync();
        return Ok(cartItems);
    }
    
    [HttpGet("items/{id}")]
    public async Task<ActionResult<CartItemGetDTO>> GetById(int id)
    {
        try
        {
            var cartItem = await cartItemService.GetByIdAsync(id);
            return Ok(cartItem);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartItemGetDTO>> Create([FromBody] CartItemCreateDTO dto)
    {
        var created = await cartItemService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("items/{id}")]
    public async Task<ActionResult<CartItemGetDTO>> Update(int id, [FromBody] CartItemUpdateDTO dto)
    {
        try
        {
            var updated = await cartItemService.UpdateAsync(id, dto);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            await cartItemService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAll()
    {
        try
        {
            await cartItemService.DeleteAllAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}