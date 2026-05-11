using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Description).HasMaxLength(1000);

        builder.Property(p => p.Price)
            .IsRequired()
            .HasPrecision(10, 2);

        builder.Property(p => p.ImageUrl).HasMaxLength(500);

        builder.HasData(
            new Product { Id = 1, Name = "Banana", Price = 3.99m },
            new Product { Id = 2, Name = "Apple", Price = 5.99m },
            new Product { Id = 3, Name = "Orange", Price = 4.49m },
            new Product { Id = 4, Name = "Carrot", Price = 2.99m },
            new Product { Id = 5, Name = "Tomato", Price = 6.99m },
            new Product { Id = 6, Name = "Spinach", Price = 8.49m },
            new Product { Id = 7, Name = "Milk", Price = 7.99m },
            new Product { Id = 8, Name = "Cheese", Price = 24.99m },
            new Product { Id = 9, Name = "Yogurt", Price = 5.49m },
            new Product { Id = 10, Name = "Orange Juice", Price = 12.99m },
            new Product { Id = 11, Name = "Still Water", Price = 3.49m },
            new Product { Id = 12, Name = "Cola", Price = 8.99m },
            new Product { Id = 13, Name = "Chips", Price = 9.99m },
            new Product { Id = 14, Name = "Chocolate Bar", Price = 14.99m },
            new Product { Id = 15, Name = "Crackers", Price = 7.49m }
        );
    }
}