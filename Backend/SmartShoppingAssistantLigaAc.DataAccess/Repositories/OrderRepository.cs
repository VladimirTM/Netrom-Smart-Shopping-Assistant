using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class OrderRepository(SmartShoppingAssistantDbContext context) : IOrderRepository
{
    public async Task<Order> AddAsync(Order order)
    {
        context.Orders.Add(order);
        await context.SaveChangesAsync();
        return order;
    }

    public async Task<List<Order>> GetByUserIdAsync(int userId)
    {
        return await context.Orders
            .Include(o => o.Items)
            .Include(o => o.AppliedPromotions).ThenInclude(ap => ap.Promotion)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.PlacedAt)
            .ToListAsync();
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await context.Orders
            .Include(o => o.Items)
            .Include(o => o.AppliedPromotions).ThenInclude(ap => ap.Promotion)
            .Include(o => o.User)
            .OrderByDescending(o => o.PlacedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await context.Orders
            .Include(o => o.Items)
            .Include(o => o.AppliedPromotions).ThenInclude(ap => ap.Promotion)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task UpdateStatusAsync(int id, string status)
    {
        var order = await context.Orders.FindAsync(id);
        if (order is null) throw new KeyNotFoundException($"Order with id {id} not found.");
        order.Status = status;
        await context.SaveChangesAsync();
    }
}
