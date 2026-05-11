using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Description).HasMaxLength(500);

        builder.HasMany(c => c.Products)
            .WithMany(p => p.Categories)
            .UsingEntity("ProductCategories",
                r => r.HasOne(typeof(Product)).WithMany().HasForeignKey("ProductId"),
                l => l.HasOne(typeof(Category)).WithMany().HasForeignKey("CategoryId"),
                j => j.HasData(
                    new { CategoryId = 1, ProductId = 1 },
                    new { CategoryId = 1, ProductId = 2 },
                    new { CategoryId = 1, ProductId = 3 },
                    new { CategoryId = 2, ProductId = 4 },
                    new { CategoryId = 2, ProductId = 5 },
                    new { CategoryId = 2, ProductId = 6 },
                    new { CategoryId = 3, ProductId = 7 },
                    new { CategoryId = 3, ProductId = 8 },
                    new { CategoryId = 3, ProductId = 9 },
                    new { CategoryId = 4, ProductId = 10 },
                    new { CategoryId = 4, ProductId = 11 },
                    new { CategoryId = 4, ProductId = 12 },
                    new { CategoryId = 5, ProductId = 13 },
                    new { CategoryId = 5, ProductId = 14 },
                    new { CategoryId = 5, ProductId = 15 }
                ));

        builder.HasData(
            new Category { Id = 1, Name = "Fruits", Description = "Fresh fruits and berries" },
            new Category { Id = 2, Name = "Vegetables", Description = "Fresh vegetables and greens" },
            new Category { Id = 3, Name = "Dairy", Description = "Milk, cheese, yogurt and other dairy products" },
            new Category { Id = 4, Name = "Beverages", Description = "Water, juices, soft drinks and more" },
            new Category { Id = 5, Name = "Snacks", Description = "Chips, chocolate and light snacks" }
        );
    }
}