using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Core.Entities;
using EventManagementSystem.Core.Interfaces;

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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Event evt)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _eventRepository.AddAsync(evt);
            await _eventRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = evt.Id }, evt);
        }
    }
}
