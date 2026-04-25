using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductGetDTO>>> GetAll(
        [FromQuery] string? name,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var products = await productService.GetAllAsync(name, minPrice, maxPrice);
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
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<ProductGetDTO>> Create([FromBody] ProductCreateDTO dto)
    {
        var created = await productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductGetDTO>> Update(int id, [FromBody] ProductUpdateDTO dto)
    {
        try
        {
            var updated = await productService.UpdateAsync(id, dto);
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
            await productService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}
