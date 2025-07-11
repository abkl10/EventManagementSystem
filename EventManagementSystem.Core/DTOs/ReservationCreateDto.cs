namespace EventManagementSystem.Core.DTOs
{
    public class ReservationCreateDto
    {
        public string UserId { get; set; } = string.Empty;
        public int EventId { get; set; }
        public int Quantity { get; set; }
    }
}
