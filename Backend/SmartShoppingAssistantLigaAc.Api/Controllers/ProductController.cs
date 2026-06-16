using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/products")]
[ApiController]
public class ProductController(IProductService productService, IActivityLogService activityLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductGetDTO>>> GetAll([FromQuery] int? categoryId = null)
    {
        var products = await productService.GetAllAsync(categoryId);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductGetDTO>> GetById(int id)
    {
        try
        {
            var product = await productService.GetByIdAsync(id);
            return Ok(product);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{id}/related")]
    public async Task<ActionResult<List<ProductGetDTO>>> GetRelated(int id)
    {
        try
        {
            var related = await productService.GetRelatedAsync(id);
            return Ok(related);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("batch")]
    public async Task<ActionResult<List<ProductGetDTO>>> GetByIds([FromBody] List<int> ids)
    {
        if (ids == null || ids.Count == 0)
            return Ok(new List<ProductGetDTO>());

        var products = await productService.GetByIdsAsync(ids);
        return Ok(products);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ProductGetDTO>> Create([FromBody] ProductCreateDTO dto)
    {
        try
        {
            var created = await productService.CreateAsync(dto);
            await activityLogService.LogAsync("ProductCreated", "Product", created.Id, created.Name, ActorId(), ActorEmail());
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ProductGetDTO>> Update(int id, [FromBody] ProductUpdateDTO dto)
    {
        try
        {
            var updated = await productService.UpdateAsync(id, dto);
            await activityLogService.LogAsync("ProductUpdated", "Product", updated.Id, updated.Name, ActorId(), ActorEmail());
            return Ok(updated);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var product = await productService.GetByIdAsync(id);
            await productService.DeleteAsync(id);
            await activityLogService.LogAsync("ProductDeleted", "Product", id, product.Name, ActorId(), ActorEmail());
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    private int? ActorId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }

    private string? ActorEmail() => User.FindFirst(ClaimTypes.Email)?.Value;
}
