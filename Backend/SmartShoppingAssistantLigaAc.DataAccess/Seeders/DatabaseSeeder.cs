namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class DatabaseSeeder(
    CategorySeeder categorySeeder,
    ProductSeeder productSeeder,
    PromotionSeeder promotionSeeder)
{
    public async Task SeedAsync()
    {
        await categorySeeder.SeedAsync();
        await productSeeder.SeedAsync();
        await promotionSeeder.SeedAsync();
    }
}
