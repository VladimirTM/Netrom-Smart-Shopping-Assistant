using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> FindByEmailAsync(string email);
}
