using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryGetDTO>> GetAllAsync();
    Task<CategoryGetDTO> GetByIdAsync(int id);
    Task<CategoryGetDTO> CreateAsync(CategoryCreateDTO dto);
    Task<CategoryGetDTO> UpdateAsync(int id, CategoryUpdateDTO dto);
    Task DeleteAsync(int id);
}