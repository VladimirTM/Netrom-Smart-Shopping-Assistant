using Microsoft.EntityFrameworkCore;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class BaseRepository<TEntity>(SmartShoppingAssistantDbContext context) : IRepository<TEntity> where TEntity : class
{
    protected readonly SmartShoppingAssistantDbContext Context = context;
    
    public IQueryable<TEntity> GetAllAsQueryable() => context.Set<TEntity>().AsQueryable();

    public async Task<TEntity> GetByIdAsync(int id)
    {
        var entity = await Context.Set<TEntity>().FindAsync(id);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Entity with id {id} not found");
        }

        return entity;
    }

    public async Task<List<TEntity>> GetAllAsync()
    {
        return await Context.Set<TEntity>().ToListAsync();
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
        var addedEntity = await Context.Set<TEntity>().AddAsync(entity);
        await Context.SaveChangesAsync();
        return addedEntity.Entity;
    }

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
        var updatedEntity = Context.Set<TEntity>().Update(entity);
        await Context.SaveChangesAsync();
        return updatedEntity.Entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await Context.Set<TEntity>().FindAsync(id);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Entity with id {id} not found");
        }

        Context.Set<TEntity>().Remove(entity);
        await Context.SaveChangesAsync();
    }

    public async Task DeleteAllAsync()
    {
        var entities = await Context.Set<TEntity>().ToListAsync();
        Context.Set<TEntity>().RemoveRange(entities);
        await Context.SaveChangesAsync();
    }
}
