namespace EventManagementSystem.Core.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        void Update(T entity);
        Task UpdateAsync(T entity);         
        Task DeleteAsync(T entity); 
        void Delete(T entity);
        Task SaveChangesAsync();
    }
}
