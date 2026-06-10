using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class UserSeeder(SmartShoppingAssistantDbContext context)
{
    public async Task SeedAsync()
    {
        if (await context.Users.AnyAsync())
            return;

        context.Users.Add(new User
        {
            Email = "admin@shop.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "admin",
            CreatedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
