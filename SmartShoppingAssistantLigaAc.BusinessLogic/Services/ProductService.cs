using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class ProductService(IRepository<Product> productRepository) : IProductService
{
    public async Task<ProductGetDTO> GetByIdAsync(int id)
    {
        var product = await productRepository.GetByIdAsync(id);

        return new ProductGetDTO
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            ImageUrl = product.ImageUrl,
            Price = product.Price
        };
    }
}