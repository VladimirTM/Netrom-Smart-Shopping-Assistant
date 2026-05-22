using Microsoft.Agents.AI;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

public interface IPromotionCheckerAgent
{
    ChatClientAgent Build(string cartJson);
}