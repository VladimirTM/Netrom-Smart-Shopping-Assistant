using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IProductService
{
    Task<List<ProductGetDTO>> GetAllAsync();
    Task<ProductGetDTO> GetByIdAsync(int id);
    Task<ProductGetDTO> CreateAsync(ProductCreateDTO dto);
    Task<ProductGetDTO> UpdateAsync(int id, ProductUpdateDTO dto);
    Task DeleteAsync(int id);
}