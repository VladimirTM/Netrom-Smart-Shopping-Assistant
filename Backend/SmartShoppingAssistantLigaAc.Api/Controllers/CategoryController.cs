using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/categories")]
[ApiController]
public class CategoryController(ICategoryService categoryService, IActivityLogService activityLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryGetDTO>>> GetAll()
    {
        var categories = await categoryService.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryGetDTO>> GetById(int id)
    {
        try
        {
            var category = await categoryService.GetByIdAsync(id);
            return Ok(category);
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
    public async Task<ActionResult<CategoryGetDTO>> Create([FromBody] CategoryCreateDTO dto)
    {
        var created = await categoryService.CreateAsync(dto);
        await activityLogService.LogAsync("CategoryCreated", "Category", created.Id, created.Name, ActorId(), ActorEmail());
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<CategoryGetDTO>> Update(int id, [FromBody] CategoryUpdateDTO dto)
    {
        try
        {
            var updated = await categoryService.UpdateAsync(id, dto);
            await activityLogService.LogAsync("CategoryUpdated", "Category", updated.Id, updated.Name, ActorId(), ActorEmail());
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
            var category = await categoryService.GetByIdAsync(id);
            await categoryService.DeleteAsync(id);
            await activityLogService.LogAsync("CategoryDeleted", "Category", id, category.Name, ActorId(), ActorEmail());
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