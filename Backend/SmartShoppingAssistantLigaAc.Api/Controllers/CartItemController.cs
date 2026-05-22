using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/cart")]
[ApiController]
public class CartItemController(ICartItemService cartItemService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CartGetDTO>> GetAll()
    {
        var cart = await cartItemService.GetAllAsync();
        return Ok(cart);
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
    public async Task<ActionResult<CartGetDTO>> Create([FromBody] CartItemCreateDTO dto)
    {
        var cart = await cartItemService.CreateAsync(dto);
        return Ok(cart);
    }

    [HttpPut("items/{id}")]
    public async Task<ActionResult<CartGetDTO>> Update(int id, [FromBody] CartItemUpdateDTO dto)
    {
        try
        {
            var cart = await cartItemService.UpdateAsync(id, dto);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("items/{id}")]
    public async Task<ActionResult<CartGetDTO>> Delete(int id)
    {
        try
        {
            var cart = await cartItemService.DeleteAsync(id);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAll()
    {
        await cartItemService.DeleteAllAsync();
        return NoContent();
    }
    
    [HttpPost("analyze")]
    public async Task<IActionResult> AnalyzeCart()
    {
        var analysisResponse = await cartItemService.AnalyzeCartAsync();
        return Ok(analysisResponse);
    }
}
