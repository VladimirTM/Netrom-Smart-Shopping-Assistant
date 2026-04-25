using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class ProductService(IRepository<Product> productRepository) : IProductService
{
    public async Task<List<ProductGetDTO>> GetAllAsync()
    {
        var products = await productRepository.GetAllAsync();
        
        return products.Select(MapToDTO).ToList();
    }

    public async Task<ProductGetDTO> GetByIdAsync(int id)
    {
        var product = await productRepository.GetByIdAsync(id);
        return MapToDTO(product);
    }

    public async Task<ProductGetDTO> CreateAsync(ProductCreateDTO dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl
        };

        var created = await productRepository.AddAsync(product);
        return MapToDTO(created);
    }

    public async Task<ProductGetDTO> UpdateAsync(int id, ProductUpdateDTO dto)
    {
        var product = await productRepository.GetByIdAsync(id);

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.ImageUrl = dto.ImageUrl;

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
        Price = product.Price
    };
}