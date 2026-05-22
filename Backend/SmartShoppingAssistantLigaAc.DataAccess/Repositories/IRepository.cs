namespace SmartShoppingAssistantLigaAc.DataAccess.Repositories;

public interface IRepository<TEntity> where TEntity : class
{
    IQueryable<TEntity> GetAllAsQueryable();
    Task<TEntity> GetByIdAsync(int id);
    Task<List<TEntity>> GetAllAsync();
    Task<TEntity> AddAsync(TEntity entity);
    Task<TEntity> UpdateAsync(TEntity entity);
    Task DeleteAsync(int id);
    Task DeleteAllAsync();
}