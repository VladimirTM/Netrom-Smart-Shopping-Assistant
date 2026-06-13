using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/promotions")]
[ApiController]
public class PromotionController(IPromotionService promotionService, IActivityLogService activityLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PromotionGetDTO>>> GetAll([FromQuery] bool activeOnly = false)
    {
        var promotions = await promotionService.GetAllAsync(activeOnly);
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
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<PromotionGetDTO>> Create([FromBody] PromotionCreateDTO dto)
    {
        var created = await promotionService.CreateAsync(dto);
        await activityLogService.LogAsync("PromotionCreated", "Promotion", created.Id, created.Name, ActorId(), ActorEmail());
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<PromotionGetDTO>> Update(int id, [FromBody] PromotionUpdateDTO dto)
    {
        try
        {
            var updated = await promotionService.UpdateAsync(id, dto);
            await activityLogService.LogAsync("PromotionUpdated", "Promotion", updated.Id, updated.Name, ActorId(), ActorEmail());
            return Ok(updated);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var promotion = await promotionService.GetByIdAsync(id);
            await promotionService.DeleteAsync(id);
            await activityLogService.LogAsync("PromotionDeleted", "Promotion", id, promotion.Name, ActorId(), ActorEmail());
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    private int? ActorId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }

    private string? ActorEmail() => User.FindFirst(ClaimTypes.Email)?.Value;
}