using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess;

public class SmartShoppingAssistantDbContext(DbContextOptions<SmartShoppingAssistantDbContext> options)
    : DbContext(options)
{
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Promotion> Promotions { get; set; } = null!;
    public DbSet<CartItem> CartItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SmartShoppingAssistantDbContext).Assembly);
    }
}