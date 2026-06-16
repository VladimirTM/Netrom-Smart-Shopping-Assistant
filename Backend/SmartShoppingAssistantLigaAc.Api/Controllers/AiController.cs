using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/ai")]
[ApiController]
[Authorize]
public class AiController(IAiSearchService aiSearchService) : ControllerBase
{
    [HttpPost("search")]
    public async Task<ActionResult<List<ProductGetDTO>>> Search([FromBody] AiSearchRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
            return BadRequest("Query is required.");

        try
        {
            var results = await aiSearchService.SearchAsync(request.Query);
            return Ok(results);
        }
        catch (Exception)
        {
            return StatusCode(500, "AI service is currently unavailable.");
        }
    }
}
