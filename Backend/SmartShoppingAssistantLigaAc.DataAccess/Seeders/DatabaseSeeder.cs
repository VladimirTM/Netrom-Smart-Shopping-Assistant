using Microsoft.Extensions.Configuration;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class DatabaseSeeder(
    CategorySeeder categorySeeder,
    ProductSeeder productSeeder,
    PromotionSeeder promotionSeeder,
    BannerSeeder bannerSeeder,
    UserSeeder userSeeder,
    IConfiguration configuration)
{
    public async Task SeedAsync()
    {
        await categorySeeder.SeedAsync();
        await productSeeder.SeedAsync();
        await promotionSeeder.SeedAsync();
        await bannerSeeder.SeedAsync();
        await userSeeder.SeedAsync(configuration);
    }
}
