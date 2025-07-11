namespace EventManagementSystem.Core.Entities
{
    public class Reservation
    {
        public int Id { get; set; }  // Clé primaire
        public DateTime ReservationDate { get; set; }
        
        // Clé étrangère vers User
        public int UserId { get; set; }
        public User User { get; set; } = default!;
        
        // Tu pourras ajouter un lien vers Event plus tard si tu as une entité Event
    }
}