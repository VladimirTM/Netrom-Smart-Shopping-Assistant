using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services;

public class BannerService(IBannerRepository bannerRepository) : IBannerService
{
    public async Task<List<BannerGetDTO>> GetAllAsync(bool activeOnly = false)
    {
        var banners = activeOnly
            ? await bannerRepository.GetAllActiveAsync()
            : (await bannerRepository.GetAllAsync()).OrderBy(b => b.DisplayOrder).ToList();

        return banners.Select(MapToDTO).ToList();
    }

    public async Task<BannerGetDTO> GetByIdAsync(int id)
    {
        var banner = await bannerRepository.GetByIdAsync(id);
        return MapToDTO(banner);
    }

    public async Task<BannerGetDTO> CreateAsync(BannerCreateDTO dto)
    {
        var banner = new Banner
        {
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            ImageUrl = dto.ImageUrl,
            LinkTo = dto.LinkTo,
            PromotionId = dto.PromotionId,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow
        };

        var created = await bannerRepository.AddAsync(banner);
        return MapToDTO(created);
    }

    public async Task<BannerGetDTO> UpdateAsync(int id, BannerUpdateDTO dto)
    {
        var banner = await bannerRepository.GetByIdAsync(id);

        banner.Title = dto.Title;
        banner.Subtitle = dto.Subtitle;
        banner.ImageUrl = dto.ImageUrl;
        banner.LinkTo = dto.LinkTo;
        banner.PromotionId = dto.PromotionId;
        banner.IsActive = dto.IsActive;
        banner.DisplayOrder = dto.DisplayOrder;

        var updated = await bannerRepository.UpdateAsync(banner);
        return MapToDTO(updated);
    }

    public async Task DeleteAsync(int id)
    {
        await bannerRepository.DeleteAsync(id);
    }

    private static BannerGetDTO MapToDTO(Banner banner) => new()
    {
        Id = banner.Id,
        Title = banner.Title,
        Subtitle = banner.Subtitle,
        ImageUrl = banner.ImageUrl,
        LinkTo = banner.LinkTo,
        PromotionId = banner.PromotionId,
        IsActive = banner.IsActive,
        DisplayOrder = banner.DisplayOrder,
        CreatedAt = banner.CreatedAt
    };
}
