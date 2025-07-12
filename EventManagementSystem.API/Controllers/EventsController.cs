using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Core.Entities;
using EventManagementSystem.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;


namespace EventManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IRepository<Event> _eventRepository;

        public EventsController(IRepository<Event> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventRepository.GetAllAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var evt = await _eventRepository.GetByIdAsync(id);
            if (evt == null) return NotFound();
            return Ok(evt);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Event evt)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _eventRepository.AddAsync(evt);
            await _eventRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = evt.Id }, evt);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event updatedEvent)
        {
            var existingEvent = await _eventRepository.GetByIdAsync(id);
            if (existingEvent == null)
                return NotFound();

            // Mise à jour des propriétés
            existingEvent.Title = updatedEvent.Title;
            existingEvent.Description = updatedEvent.Description;
            existingEvent.Date = updatedEvent.Date;
            existingEvent.Price = updatedEvent.Price;
            existingEvent.Capacity = updatedEvent.Capacity;

            await _eventRepository.UpdateAsync(existingEvent);
            await _eventRepository.SaveChangesAsync();

            return NoContent(); 
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingEvent = await _eventRepository.GetByIdAsync(id);
            if (existingEvent == null)
                return NotFound();

            await _eventRepository.DeleteAsync(existingEvent);
            await _eventRepository.SaveChangesAsync();

            return NoContent(); 
        }
    }
}
