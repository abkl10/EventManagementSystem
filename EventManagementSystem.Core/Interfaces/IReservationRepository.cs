using EventManagementSystem.Core.Entities;

namespace EventManagementSystem.Core.Interfaces
{
    public interface IReservationRepository : IRepository<Reservation>
    {
        Task<IEnumerable<Reservation>> GetAllWithEventAsync();
    }
}
