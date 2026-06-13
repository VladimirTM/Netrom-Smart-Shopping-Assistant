namespace SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

public class ActivityLogGetDTO
{
    public int Id { get; set; }
    public string Action { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public int EntityId { get; set; }
    public string EntityName { get; set; } = null!;
    public int? ActorId { get; set; }
    public string? ActorEmail { get; set; }
    public DateTime OccurredAt { get; set; }
}
