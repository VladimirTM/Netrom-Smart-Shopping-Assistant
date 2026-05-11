using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Entities.Enums;

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

        builder.HasData(
            new Promotion { Id = 1, Name = "Banana Bundle Deal", Type = PromotionType.Quantity, Threshold = 3m, Reward = PromotionReward.FreeItems, RewardValue = 1, ProductId = 1, IsActive = true },
            new Promotion { Id = 2, Name = "Fruit Basket Discount", Type = PromotionType.Quantity, Threshold = 5m, Reward = PromotionReward.PercentDiscount, RewardValue = 10, CategoryId = 1, IsActive = true },
            new Promotion { Id = 3, Name = "Dairy Combo Deal", Type = PromotionType.Quantity, Threshold = 2m, Reward = PromotionReward.FreeItems, RewardValue = 1, CategoryId = 3, IsActive = true },
            new Promotion { Id = 4, Name = "Big Cart Discount", Type = PromotionType.CartTotal, Threshold = 100m, Reward = PromotionReward.PercentDiscount, RewardValue = 5, IsActive = true },
            new Promotion { Id = 5, Name = "Beverage Bundle", Type = PromotionType.Quantity, Threshold = 3m, Reward = PromotionReward.PercentDiscount, RewardValue = 15, CategoryId = 4, IsActive = true },
            new Promotion { Id = 6, Name = "Snack Attack", Type = PromotionType.Quantity, Threshold = 4m, Reward = PromotionReward.FreeItems, RewardValue = 1, CategoryId = 5, IsActive = true }
        );
    }
}
