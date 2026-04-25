using Microsoft.EntityFrameworkCore;

namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public class BaseRepository<TEntity>(SmartShoppingAssistantDbContext context) : IRepository<TEntity> where TEntity : class
{
    public async Task<TEntity> GetByIdAsync(int id)
    {
        try
        {
            var entity = await context.Set<TEntity>().FindAsync(id);

            if (entity == null)
            {
                throw new Exception($"Entity with id {id} not found");
            }
            
            return entity;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error retrieving entity with id {id}: {ex.Message}", ex);
        }
    }

    public async Task<List<TEntity>> GetAllAsync()
    {
        try
        {
            return await context.Set<TEntity>().ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception($"Error retrieving entities: {ex.Message}", ex);
        }
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
        try
        {
            var addedEntity = await context.Set<TEntity>().AddAsync(entity);
            await context.SaveChangesAsync();
            return addedEntity.Entity;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error adding entity: {ex.Message}", ex);
        }
    }

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
        try
        {
            var updatedEntity = context.Set<TEntity>().Update(entity);
            await context.SaveChangesAsync();
            return updatedEntity.Entity;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error updating entity: {ex.Message}", ex);
        }
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            var entity = await context.Set<TEntity>().FindAsync(id);

            if (entity == null)
            {
                throw new Exception($"Entity with id {id} not found");
            }
            
            context.Set<TEntity>().Remove(entity);
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception($"Error while deleting entity with id {id}: {ex.Message}", ex);
        }
    }
}