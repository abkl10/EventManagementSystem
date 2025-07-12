using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Core.Entities;
using EventManagementSystem.Core.Interfaces;
using EventManagementSystem.Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EventManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationRepository _reservationRepository;

        public ReservationController(IReservationRepository reservationRepository)
        {
            _reservationRepository = reservationRepository;
        }


        // GET: api/reservation
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationRepository.GetAllWithEventAsync();

            var result = reservations.Select(r => new
            {
                r.Id,
                r.ReservationDate,
                r.Quantity,
                Event = new
                {
                    r.Event.Id,
                    r.Event.Title,
                    r.Event.Date,
                    r.Event.Price
                }
            });

            return Ok(result);
        }

        // GET: api/reservation/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            if (reservation == null) return NotFound();
            return Ok(reservation);
        }

        // POST: api/reservation
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ReservationCreateDto dto)
        {
            // Get authenticated user's ID from JWT
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var reservation = new Reservation
            {
                UserId = userId,
                EventId = dto.EventId,
                Quantity = dto.Quantity,
                ReservationDate = DateTime.UtcNow
            };

            await _reservationRepository.AddAsync(reservation);
            await _reservationRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = reservation.Id }, reservation);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ReservationCreateDto dto)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            if (reservation == null) return NotFound();

            // Vérifie que l'utilisateur connecté est le propriétaire de la réservation
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (reservation.UserId != userId)
                return Forbid();

            reservation.EventId = dto.EventId;
            reservation.Quantity = dto.Quantity;
            reservation.ReservationDate = DateTime.UtcNow;

            await _reservationRepository.UpdateAsync(reservation);
            await _reservationRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/reservation/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            if (reservation == null) return NotFound();

            await _reservationRepository.DeleteAsync(reservation);
            await _reservationRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
