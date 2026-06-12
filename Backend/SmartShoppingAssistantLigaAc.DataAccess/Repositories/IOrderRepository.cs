using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IOrderRepository
{
    Task<Order> AddAsync(Order order);
    Task<List<Order>> GetByUserIdAsync(int userId);
    Task<List<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task UpdateStatusAsync(int id, string status);
}
