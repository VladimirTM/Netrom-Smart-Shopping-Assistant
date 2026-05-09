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
                l => l.HasOne(typeof(Category)).WithMany().HasForeignKey("CategoryId"));
    }
}