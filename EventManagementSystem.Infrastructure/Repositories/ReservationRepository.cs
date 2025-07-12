using EventManagementSystem.Core.Entities;
using EventManagementSystem.Core.Interfaces;
using EventManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventManagementSystem.Infrastructure.Repositories
{
    public class ReservationRepository : GenericRepository<Reservation>, IReservationRepository
    {
        private readonly ApplicationDbContext _context;

        public ReservationRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reservation>> GetAllWithEventAsync()
        {
            return await _context.Reservations
                .Include(r => r.Event)
                .ToListAsync();
        }
    }
}
