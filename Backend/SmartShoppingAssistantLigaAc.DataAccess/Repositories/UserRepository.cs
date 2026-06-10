using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class UserRepository(SmartShoppingAssistantDbContext context) : BaseRepository<User>(context), IUserRepository
{
    public async Task<User?> FindByEmailAsync(string email)
    {
        return await Context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }
}
