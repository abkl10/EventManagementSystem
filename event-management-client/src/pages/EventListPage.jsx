import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5161/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`http://localhost:5161/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🎫 All Events</h2>

      {token && (
        <button onClick={() => navigate('/events/new')} style={{ marginBottom: '1rem' }}>
          + Create New Event
        </button>
      )}

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map(event => (
            <li key={event.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{event.title}</h3>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Price:</strong> ${event.price}</p>
              <p><strong>Capacity:</strong> {event.capacity}</p>

              {token && (
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => navigate(`/events/edit/${event.id}`)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(event.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>
                    🗑️ Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventListPage;
