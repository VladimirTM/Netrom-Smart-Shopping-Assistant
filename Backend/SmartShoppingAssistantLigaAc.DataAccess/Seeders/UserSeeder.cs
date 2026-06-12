using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class UserSeeder(SmartShoppingAssistantDbContext context)
{
    public async Task SeedAsync(IConfiguration configuration)
    {
        if (await context.Users.AnyAsync())
            return;

        var adminPassword = configuration["AdminSeed:Password"]
            ?? Environment.GetEnvironmentVariable("ADMIN_SEED_PASSWORD")
            ?? throw new InvalidOperationException(
                "Admin seed password is not configured. Set AdminSeed:Password in appsettings or ADMIN_SEED_PASSWORD env var.");

        context.Users.Add(new User
        {
            Email = "admin@shop.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role = "admin",
            CreatedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
