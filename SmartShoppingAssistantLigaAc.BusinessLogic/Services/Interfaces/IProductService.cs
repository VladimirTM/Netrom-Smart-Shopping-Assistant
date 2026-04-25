using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IProductService
{
    Task<ProductGetDTO> GetByIdAsync(int id);
}