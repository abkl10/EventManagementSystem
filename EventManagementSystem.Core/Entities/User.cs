namespace EventManagementSystem.Core.Entities
{
    public class User
    {
        public int Id { get; set; }  // Clé primaire
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        
        // un utilisateur peut avoir plusieurs réservations
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
