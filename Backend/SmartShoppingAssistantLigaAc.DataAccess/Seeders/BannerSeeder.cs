using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class BannerSeeder(SmartShoppingAssistantDbContext context)
{
    public async Task SeedAsync()
    {
        if (context.Banners.Any())
            return;

        var promotions = await context.Promotions.ToDictionaryAsync(p => p.Name);

        int? PromoId(string name) => promotions.TryGetValue(name, out var p) ? p.Id : null;

        var banners = new List<Banner>
        {
            new()
            {
                Title = "Mega Sale — 8% off orders over 3000 RON",
                Subtitle = "Stack your cart and save big on any category",
                ImageUrl = "https://placehold.co/600x200/6B6400/ffffff?text=Mega+Sale",
                LinkTo = "/shop",
                PromotionId = PromoId("Mega Sale: 8% Off When Cart Exceeds 3000 RON"),
                IsActive = true,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Title = "Electronics Weekend Flash — 15% off 5000+ RON",
                Subtitle = "Limited time deal on all electronics",
                ImageUrl = "https://placehold.co/600x200/1a1a6e/ffffff?text=Electronics+Flash",
                LinkTo = "/shop",
                PromotionId = PromoId("Electronics Weekend Flash: 15% Off 5000+ RON"),
                IsActive = true,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Title = "Books 3-for-2",
                Subtitle = "Add 3 books to your cart, pay for only 2",
                ImageUrl = "https://placehold.co/600x200/2e4a1e/ffffff?text=Books+3+for+2",
                LinkTo = "/shop",
                PromotionId = PromoId("Books 3-for-2: Add 3, Pay for 2"),
                IsActive = true,
                DisplayOrder = 3,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Title = "Food Basket — 25% off orders over 200 RON",
                Subtitle = "Stock up on food & beverages and save",
                ImageUrl = "https://placehold.co/600x200/4a2e00/ffffff?text=Food+Basket",
                LinkTo = "/shop",
                PromotionId = PromoId("Food Basket: 25% Off Orders Over 200 RON"),
                IsActive = true,
                DisplayOrder = 4,
                CreatedAt = DateTime.UtcNow
            },
        };

        await context.Banners.AddRangeAsync(banners);
        await context.SaveChangesAsync();
    }
}
