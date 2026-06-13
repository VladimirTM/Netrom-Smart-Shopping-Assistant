using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/banners")]
[ApiController]
public class BannerController(IBannerService bannerService, IActivityLogService activityLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<BannerGetDTO>>> GetAll([FromQuery] bool activeOnly = false)
    {
        var banners = await bannerService.GetAllAsync(activeOnly);
        return Ok(banners);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BannerGetDTO>> GetById(int id)
    {
        try
        {
            var banner = await bannerService.GetByIdAsync(id);
            return Ok(banner);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<BannerGetDTO>> Create([FromBody] BannerCreateDTO dto)
    {
        var created = await bannerService.CreateAsync(dto);
        await activityLogService.LogAsync("BannerCreated", "Banner", created.Id, created.Title, ActorId(), ActorEmail());
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<BannerGetDTO>> Update(int id, [FromBody] BannerUpdateDTO dto)
    {
        try
        {
            var updated = await bannerService.UpdateAsync(id, dto);
            await activityLogService.LogAsync("BannerUpdated", "Banner", updated.Id, updated.Title, ActorId(), ActorEmail());
            return Ok(updated);
        }
        catch (Exception ex)
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
            var banner = await bannerService.GetByIdAsync(id);
            await bannerService.DeleteAsync(id);
            await activityLogService.LogAsync("BannerDeleted", "Banner", id, banner.Title, ActorId(), ActorEmail());
            return NoContent();
        }
        catch (Exception ex)
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
