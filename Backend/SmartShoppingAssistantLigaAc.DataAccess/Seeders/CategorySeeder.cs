using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class CategorySeeder(SmartShoppingAssistantDbContext context)
{
    public async Task SeedAsync()
    {
        if (context.Categories.Any())
            return;

        var categories = new List<Category>
        {
            new() { Name = "Electronics",           Description = "Devices, gadgets and accessories" },
            new() { Name = "Clothing",               Description = "Apparel for men, women and kids" },
            new() { Name = "Home & Kitchen",         Description = "Furniture, appliances and kitchenware" },
            new() { Name = "Sports",                 Description = "Equipment and gear for sports and outdoors" },
            new() { Name = "Books",                  Description = "Fiction, non-fiction and educational titles" },
            new() { Name = "Food & Beverages",       Description = "Groceries, snacks, drinks and gourmet items" },
            new() { Name = "Beauty & Personal Care", Description = "Skincare, haircare and grooming products" },
            new() { Name = "Toys & Games",           Description = "Toys for kids and board games for families" },
            new() { Name = "Pet Supplies",           Description = "Food, accessories and care products for pets" },
            new() { Name = "Automotive",             Description = "Car accessories, tools and maintenance products" },
            new() { Name = "Garden & Outdoors",      Description = "Plants, tools and outdoor living products" },
            new() { Name = "Health & Wellness",      Description = "Vitamins, supplements and fitness accessories" },
            new() { Name = "Office & Stationery",    Description = "Pens, notebooks and office supplies" },
            new() { Name = "Music & Instruments",    Description = "Guitars, keyboards and audio equipment" },
            new() { Name = "Arts & Crafts",          Description = "Painting, drawing and DIY craft supplies" },
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();
    }
}
