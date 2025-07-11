using EventManagementSystem.Infrastructure.Entities;

namespace EventManagementSystem.Core.Entities
{
    public class Reservation
    {
        public int Id { get; set; }

        public DateTime ReservationDate { get; set; } = DateTime.UtcNow;

        // Relations
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = default!;
        public int EventId { get; set; }
        public Event Event { get; set; } = default!;

        public int Quantity { get; set; }
    }
}