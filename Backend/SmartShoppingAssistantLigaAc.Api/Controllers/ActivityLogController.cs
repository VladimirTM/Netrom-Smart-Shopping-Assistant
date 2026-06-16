using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

namespace SmartShoppingAssistantLigaAc.Api.Controllers;

[Route("api/admin/activity-log")]
[ApiController]
[Authorize(Roles = "admin")]
public class ActivityLogController(IActivityLogService activityLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetLatest([FromQuery] int limit = 50, [FromQuery] int offset = 0)
    {
        limit = Math.Min(limit, 1000);
        offset = Math.Max(offset, 0);
        var logs = await activityLogService.GetLatestAsync(limit, offset);
        var total = await activityLogService.GetTotalCountAsync();
        return Ok(new { logs, total });
    }
}
