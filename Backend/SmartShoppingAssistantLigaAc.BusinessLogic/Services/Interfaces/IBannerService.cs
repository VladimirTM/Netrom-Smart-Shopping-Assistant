using SmartShoppingAssistantLigaAc.BusinessLogic.DTOs;

namespace SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;

public interface IBannerService
{
    Task<List<BannerGetDTO>> GetAllAsync(bool activeOnly = false);
    Task<BannerGetDTO> GetByIdAsync(int id);
    Task<BannerGetDTO> CreateAsync(BannerCreateDTO dto);
    Task<BannerGetDTO> UpdateAsync(int id, BannerUpdateDTO dto);
    Task DeleteAsync(int id);
}
