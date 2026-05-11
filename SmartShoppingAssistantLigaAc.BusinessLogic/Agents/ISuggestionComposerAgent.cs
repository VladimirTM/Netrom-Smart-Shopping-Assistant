using Microsoft.Agents.AI;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

public interface ISuggestionComposerAgent
{
    ChatClientAgent Build(string cartJson, string categoriesJson, string promotionAnalysisJson);
}
