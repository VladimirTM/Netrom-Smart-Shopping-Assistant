using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Configurations;

public class BannerConfiguration : IEntityTypeConfiguration<Banner>
{
    public void Configure(EntityTypeBuilder<Banner> builder)
    {
        builder.ToTable("Banners");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Title).IsRequired().HasMaxLength(200);
        builder.Property(b => b.Subtitle).HasMaxLength(500);
        builder.Property(b => b.ImageUrl).HasMaxLength(1000);
        builder.Property(b => b.LinkTo).HasMaxLength(500);
        builder.Property(b => b.CreatedAt).IsRequired();

        builder.HasOne(b => b.Promotion)
            .WithMany()
            .HasForeignKey(b => b.PromotionId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
