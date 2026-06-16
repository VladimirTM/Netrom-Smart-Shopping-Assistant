using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/wishlist")]
[ApiController]
[Authorize]
public class WishlistController(IWishlistService wishlistService) : ControllerBase
{
    private int? UserId => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<WishlistGetDTO>> Get()
    {
        if (UserId is not { } userId) return Unauthorized();
        return Ok(await wishlistService.GetAsync(userId));
    }

    [HttpPost("{productId}")]
    public async Task<ActionResult<WishlistGetDTO>> Add(int productId)
    {
        if (UserId is not { } userId) return Unauthorized();
        try
        {
            return Ok(await wishlistService.AddAsync(productId, userId));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{productId}")]
    public async Task<ActionResult<WishlistGetDTO>> Remove(int productId)
    {
        if (UserId is not { } userId) return Unauthorized();
        return Ok(await wishlistService.RemoveAsync(productId, userId));
    }
}
