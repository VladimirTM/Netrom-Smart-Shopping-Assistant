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
    public async Task<ActionResult<List<ActivityLogGetDTO>>> GetLatest([FromQuery] int limit = 50)
    {
        var logs = await activityLogService.GetLatestAsync(limit);
        return Ok(logs);
    }
}
