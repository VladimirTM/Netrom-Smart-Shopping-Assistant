using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/promotions")]
[ApiController]
public class PromotionController(IPromotionService promotionService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PromotionGetDTO>>> GetAll()
    {
        var promotions = await promotionService.GetAllAsync();
        return Ok(promotions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PromotionGetDTO>> GetById(int id)
    {
        try
        {
            var promotion = await promotionService.GetByIdAsync(id);
            return Ok(promotion);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<PromotionGetDTO>> Create([FromBody] PromotionCreateDTO dto)
    {
        var created = await promotionService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PromotionGetDTO>> Update(int id, [FromBody] PromotionUpdateDTO dto)
    {
        try
        {
            var updated = await promotionService.UpdateAsync(id, dto);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await promotionService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}