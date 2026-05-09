using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Configurations;

public class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
{
    public void Configure(EntityTypeBuilder<Promotion> builder)
    {
        builder.ToTable("Promotions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired().HasMaxLength(200);

        builder.Property(p => p.Type).IsRequired();

        builder.Property(p => p.Threshold).IsRequired().HasPrecision(10, 2);

        builder.Property(p => p.Reward).IsRequired();

        builder.Property(p => p.RewardValue).IsRequired();

        builder.HasOne(p => p.Product)
            .WithMany(prod => prod.Promotions)
            .HasForeignKey(p => p.ProductId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Promotions)
            .HasForeignKey(p => p.CategoryId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
