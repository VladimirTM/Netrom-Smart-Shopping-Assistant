using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IProductService
{
    Task<List<ProductGetDTO>> GetAllAsync(int? categoryId = null);
    Task<ProductGetDTO> GetByIdAsync(int id);
    Task<List<ProductGetDTO>> GetByIdsAsync(IEnumerable<int> ids);
    Task<List<ProductGetDTO>> GetRelatedAsync(int productId);
    Task<ProductGetDTO> CreateAsync(ProductCreateDTO dto);
    Task<ProductGetDTO> UpdateAsync(int id, ProductUpdateDTO dto);
    Task DeleteAsync(int id);
}