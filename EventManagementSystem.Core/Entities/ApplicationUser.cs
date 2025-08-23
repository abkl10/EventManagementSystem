using EventManagementSystem.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace EventManagementSystem.Infrastructure.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
