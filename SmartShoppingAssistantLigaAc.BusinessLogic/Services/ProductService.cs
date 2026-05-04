using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class ProductService(
    IProductRepository productRepository,
    IRepository<Category> categoryRepository) : IProductService
{
    public async Task<List<ProductGetDTO>> GetAllAsync()
    {
        var products = await productRepository.GetAllWithCategoriesAsync();
        return products.Select(MapToDTO).ToList();
    }

    public async Task<ProductGetDTO> GetByIdAsync(int id)
    {
        var product = await productRepository.GetByIdWithCategoriesAsync(id);
        return MapToDTO(product);
    }

    public async Task<ProductGetDTO> CreateAsync(ProductCreateDTO dto)
    {
        var categories = new List<Category>();
        foreach (var categoryId in dto.CategoryIds)
        {
            categories.Add(await categoryRepository.GetByIdAsync(categoryId));
        }

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            Categories = categories
        };

        var created = await productRepository.AddAsync(product);
        return MapToDTO(created);
    }

    public async Task<ProductGetDTO> UpdateAsync(int id, ProductUpdateDTO dto)
    {
        var product = await productRepository.GetByIdWithCategoriesAsync(id);

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.ImageUrl = dto.ImageUrl;
        
        product.Categories.Clear();
        foreach (var categoryId in dto.CategoryIds)
        {
            var category = await categoryRepository.GetByIdAsync(categoryId);
            product.Categories.Add(category);
        }

        var updated = await productRepository.UpdateAsync(product);
        return MapToDTO(updated);
    }

    public async Task DeleteAsync(int id)
    {
        await productRepository.DeleteAsync(id);
    }

    private static ProductGetDTO MapToDTO(Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        ImageUrl = product.ImageUrl,
        Price = product.Price,
        Categories = product.Categories.Select(c => new CategoryGetDTO
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description
        }).ToList()
    };
}