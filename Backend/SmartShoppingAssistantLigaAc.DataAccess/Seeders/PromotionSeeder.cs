using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class PromotionSeeder(SmartShoppingAssistantDbContext context)
{
    public async Task SeedAsync()
    {
        if (context.Promotions.Any())
            return;

        var products = await context.Products.ToDictionaryAsync(p => p.Name);
        var cats = await context.Categories.ToDictionaryAsync(c => c.Name);

        int? ProductId(string name) => products.TryGetValue(name, out var p) ? p.Id : null;
        int? CategoryId(string name) => cats.TryGetValue(name, out var c) ? c.Id : null;

        var promotions = new List<Promotion>
        {
            // ── Electronics ──────────────────────────────────────────────────────────
            new() { Name = "iPhone 15 Pro: Buy 2, Save 10%",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    ProductId = ProductId("iPhone 15 Pro"), IsActive = true },
            new() { Name = "iPhone 15 Pro: Buy 3, Save 20%",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.PercentDiscount, RewardValue = 20,
                    ProductId = ProductId("iPhone 15 Pro"), IsActive = true },
            new() { Name = "Electronics Weekend Flash: 15% Off 5000+ RON",
                    Type = PromotionType.CartTotal, Threshold = 5000, Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    CategoryId = CategoryId("Electronics"), IsActive = true },
            new() { Name = "Garmin Forerunner 265: 5% Off Any Purchase",
                    Type = PromotionType.Quantity,  Threshold = 1,    Reward = PromotionReward.PercentDiscount, RewardValue = 5,
                    ProductId = ProductId("Garmin Forerunner 265"), IsActive = true },
            new() { Name = "Garmin Forerunner 265: Buy 2, Save 15%",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    ProductId = ProductId("Garmin Forerunner 265"), IsActive = true },

            // ── Clothing ─────────────────────────────────────────────────────────────
            new() { Name = "Nike Air Max: Buy 2 Get 15% Off",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    ProductId = ProductId("Nike Air Max 270"), IsActive = true },
            new() { Name = "Nike Air Max: Buy 3 Get 1 Free",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.FreeItems,       RewardValue = 1,
                    ProductId = ProductId("Nike Air Max 270"), IsActive = true },
            new() { Name = "Clothing Flash Sale: 20% Off Orders Over 500 RON",
                    Type = PromotionType.CartTotal, Threshold = 500,  Reward = PromotionReward.PercentDiscount, RewardValue = 20,
                    CategoryId = CategoryId("Clothing"), IsActive = true },

            // ── Food & Beverages ─────────────────────────────────────────────────────
            new() { Name = "Lavazza: Buy 2 Bags, Save 10%",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    ProductId = ProductId("Lavazza Espresso Beans 1kg"), IsActive = true },
            new() { Name = "Lavazza: Buy 3 Bags, Save 25%",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.PercentDiscount, RewardValue = 25,
                    ProductId = ProductId("Lavazza Espresso Beans 1kg"), IsActive = true },
            new() { Name = "Nescafe Gold: 15% Off When You Buy 2+",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    ProductId = ProductId("Nescafe Gold Premium 500g"), IsActive = true },
            new() { Name = "Nescafe Gold: Buy 3, Get 1 Free",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.FreeItems,       RewardValue = 1,
                    ProductId = ProductId("Nescafe Gold Premium 500g"), IsActive = true },
            new() { Name = "Pringles: Buy 3 Get 1 Free",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.FreeItems,       RewardValue = 1,
                    ProductId = ProductId("Pringles Variety Pack 12"), IsActive = true },
            new() { Name = "Food Basket: 25% Off Orders Over 200 RON",
                    Type = PromotionType.CartTotal, Threshold = 200,  Reward = PromotionReward.PercentDiscount, RewardValue = 25,
                    CategoryId = CategoryId("Food & Beverages"), IsActive = true },

            // ── Books ─────────────────────────────────────────────────────────────────
            new() { Name = "Books 3-for-2: Add 3, Pay for 2",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.FreeItems,       RewardValue = 1,
                    CategoryId = CategoryId("Books"), IsActive = true },
            new() { Name = "Books: 20% Off When You Spend 200+ RON",
                    Type = PromotionType.CartTotal, Threshold = 200,  Reward = PromotionReward.PercentDiscount, RewardValue = 20,
                    CategoryId = CategoryId("Books"), IsActive = true },

            // ── Sports ────────────────────────────────────────────────────────────────
            new() { Name = "Sports: 10% Off Orders Over 500 RON",
                    Type = PromotionType.CartTotal, Threshold = 500,  Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    CategoryId = CategoryId("Sports"), IsActive = true },
            new() { Name = "Fitbit Charge 6: 8% Off Single Unit",
                    Type = PromotionType.Quantity,  Threshold = 1,    Reward = PromotionReward.PercentDiscount, RewardValue = 8,
                    ProductId = ProductId("Fitbit Charge 6"), IsActive = true },
            new() { Name = "Fitbit Charge 6: Buy 2, Save 18%",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 18,
                    ProductId = ProductId("Fitbit Charge 6"), IsActive = true },

            // ── Home & Kitchen ────────────────────────────────────────────────────────
            new() { Name = "Instant Pot: Buy 2, Get 15% Off",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    ProductId = ProductId("Instant Pot Duo 7-in-1"), IsActive = true },
            new() { Name = "Instant Pot: Buy 3, Get 1 Free",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.FreeItems,       RewardValue = 1,
                    ProductId = ProductId("Instant Pot Duo 7-in-1"), IsActive = true },
            new() { Name = "KitchenAid: 10% Off When Cart Exceeds 1500 RON",
                    Type = PromotionType.CartTotal, Threshold = 1500, Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    ProductId = ProductId("KitchenAid Stand Mixer"), IsActive = true },
            new() { Name = "Home & Kitchen: 12% Off Orders Over 500 RON",
                    Type = PromotionType.CartTotal, Threshold = 500,  Reward = PromotionReward.PercentDiscount, RewardValue = 12,
                    CategoryId = CategoryId("Home & Kitchen"), IsActive = true },

            // ── Beauty & Personal Care ────────────────────────────────────────────────
            new() { Name = "Oral-B iO Series 9: Buy 2, Save 20%",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 20,
                    ProductId = ProductId("Oral-B iO Series 9"), IsActive = true },
            new() { Name = "Oral-B iO Series 9: Buy 3, Get 1 Free",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.FreeItems,       RewardValue = 1,
                    ProductId = ProductId("Oral-B iO Series 9"), IsActive = true },
            new() { Name = "Beauty: 30% Off When You Buy 3+ Items",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.PercentDiscount, RewardValue = 30,
                    CategoryId = CategoryId("Beauty & Personal Care"), IsActive = true },

            // ── Health & Wellness ─────────────────────────────────────────────────────
            new() { Name = "ON Whey 2kg: Buy 2, Save 15%",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    ProductId = ProductId("Optimum Nutrition Whey 2kg"), IsActive = true },
            new() { Name = "ON Whey 2kg: Buy 3, Save 25%",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.PercentDiscount, RewardValue = 25,
                    ProductId = ProductId("Optimum Nutrition Whey 2kg"), IsActive = true },
            new() { Name = "Health Supplements: 10% Off Orders Over 200 RON",
                    Type = PromotionType.CartTotal, Threshold = 200,  Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    CategoryId = CategoryId("Health & Wellness"), IsActive = true },

            // ── Music & Instruments ───────────────────────────────────────────────────
            new() { Name = "Yamaha P-45: 5% Welcome Discount",
                    Type = PromotionType.Quantity,  Threshold = 1,    Reward = PromotionReward.PercentDiscount, RewardValue = 5,
                    ProductId = ProductId("Yamaha P-45 Digital Piano"), IsActive = true },
            new() { Name = "Music: 15% Off Orders Over 3000 RON",
                    Type = PromotionType.CartTotal, Threshold = 3000, Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    CategoryId = CategoryId("Music & Instruments"), IsActive = true },

            // ── Automotive ────────────────────────────────────────────────────────────
            new() { Name = "Garmin DashCam: 8% Off When Buying 2+",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 8,
                    ProductId = ProductId("Garmin DashCam 67W"), IsActive = true },

            // ── Office & Stationery ───────────────────────────────────────────────────
            new() { Name = "Back to School: 15% Off Orders Over 150 RON",
                    Type = PromotionType.CartTotal, Threshold = 150,  Reward = PromotionReward.PercentDiscount, RewardValue = 15,
                    CategoryId = CategoryId("Office & Stationery"), IsActive = true },

            // ── Toys & Games ─────────────────────────────────────────────────────────
            new() { Name = "LEGO Technic: 10% Off When Buying 2 Sets",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    ProductId = ProductId("LEGO Technic Bugatti Chiron"), IsActive = true },
            new() { Name = "Toys & Games: 20% Off When You Add 3+ Items",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.PercentDiscount, RewardValue = 20,
                    CategoryId = CategoryId("Toys & Games"), IsActive = true },

            // ── Pet Supplies ──────────────────────────────────────────────────────────
            new() { Name = "Royal Canin: Subscribe & Save 10% (2 Bags)",
                    Type = PromotionType.Quantity,  Threshold = 2,    Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    ProductId = ProductId("Royal Canin Large Adult 15kg"), IsActive = true },
            new() { Name = "Royal Canin: Buy 3 Bags, Save 20%",
                    Type = PromotionType.Quantity,  Threshold = 3,    Reward = PromotionReward.PercentDiscount, RewardValue = 20,
                    ProductId = ProductId("Royal Canin Large Adult 15kg"), IsActive = true },

            // ── Garden & Outdoors ─────────────────────────────────────────────────────
            new() { Name = "Garden & Outdoors: 10% Off Orders Over 2000 RON",
                    Type = PromotionType.CartTotal, Threshold = 2000, Reward = PromotionReward.PercentDiscount, RewardValue = 10,
                    CategoryId = CategoryId("Garden & Outdoors"), IsActive = true },

            // ── Arts & Crafts ─────────────────────────────────────────────────────────
            new() { Name = "Arts & Crafts: 12% Off Orders Over 300 RON",
                    Type = PromotionType.CartTotal, Threshold = 300,  Reward = PromotionReward.PercentDiscount, RewardValue = 12,
                    CategoryId = CategoryId("Arts & Crafts"), IsActive = true },

            // ── Cross-category sitewide deals ─────────────────────────────────────────
            new() { Name = "Mega Sale: 8% Off When Cart Exceeds 3000 RON",
                    Type = PromotionType.CartTotal, Threshold = 3000, Reward = PromotionReward.PercentDiscount, RewardValue = 8,
                    IsActive = true },
            new() { Name = "VIP Deal: 12% Off When Cart Exceeds 6000 RON",
                    Type = PromotionType.CartTotal, Threshold = 6000, Reward = PromotionReward.PercentDiscount, RewardValue = 12,
                    IsActive = true },
        };

        await context.Promotions.AddRangeAsync(promotions);
        await context.SaveChangesAsync();
    }
}
