using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class CategoryService(IRepository<Category> categoryRepository) : ICategoryService
{
    public async Task<List<CategoryGetDTO>> GetAllAsync()
    {
        var categories = await categoryRepository.GetAllAsync();
        
        return categories.Select(MapToDTO).ToList();
    }

    public async Task<CategoryGetDTO> GetByIdAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        
        return MapToDTO(category);
    }

    public async Task<CategoryGetDTO> CreateAsync(CategoryCreateDTO dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description
        };
        
        var created = await categoryRepository.AddAsync(category);
        return MapToDTO(created);
    }

    public async Task<CategoryGetDTO> UpdateAsync(int id, CategoryUpdateDTO dto)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        
        category.Name = dto.Name;
        category.Description = dto.Description;
        
        var updated = await categoryRepository.UpdateAsync(category);
        return MapToDTO(updated);
    }

    public async Task DeleteAsync(int id)
    {
        await categoryRepository.DeleteAsync(id);
    }
    
    private static CategoryGetDTO MapToDTO(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Description = category.Description
    };
}