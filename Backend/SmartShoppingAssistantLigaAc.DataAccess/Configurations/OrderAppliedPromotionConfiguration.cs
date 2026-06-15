using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Configurations;

public class OrderAppliedPromotionConfiguration : IEntityTypeConfiguration<OrderAppliedPromotion>
{
    public void Configure(EntityTypeBuilder<OrderAppliedPromotion> builder)
    {
        builder.ToTable("OrderAppliedPromotions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Discount).IsRequired().HasPrecision(10, 2);

        builder.HasOne(p => p.Order)
            .WithMany(o => o.AppliedPromotions)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Promotion)
            .WithMany(pr => pr.OrderUsages)
            .HasForeignKey(p => p.PromotionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
