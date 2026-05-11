using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SmartShoppingAssistantLigaAc.DataAccess;

public class SmartShoppingAssistantDbContextFactory : IDesignTimeDbContextFactory<SmartShoppingAssistantDbContext>
{
    public SmartShoppingAssistantDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__SmartShoppingAssistantContext")
            ?? "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=SmartShoppingAssistant;Pooling=true;";

        var options = new DbContextOptionsBuilder<SmartShoppingAssistantDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new SmartShoppingAssistantDbContext(options);
    }
}
