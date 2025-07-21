import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationFormPage = () => {
  const { id } = useParams(); // pour l’édition si id existe
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [error, setError] = useState('');


  const [form, setForm] = useState({
    eventId: '',
    quantity: 1
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Charger tous les événements pour le select
    axios.get('http://localhost:5161/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));

    if (id) {
      axios.get(`http://localhost:5161/api/reservation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setForm(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    if (id) {
      await axios.put(`http://localhost:5161/api/reservation/${id}`, form, config);
    } else {
      await axios.post(`http://localhost:5161/api/reservation`, form, config);
    }
    setError('');
    navigate('/reservations');
  } catch (err) {
    if (err.response && err.response.status === 400) {
      setError(err.response.data); 
    } else {
      setError('An error occurred. Please try again.');
    }
  }
};


  return (
    <div style={{ padding: '1rem' }}>
      <h2>{id ? 'Edit Reservation' : 'Create Reservation'}</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label>
        Event:
        </label>
        <select name="eventId" value={form.eventId} onChange={handleChange} required>
          <option value="">Select an event</option>
          {events.map(evt => (
            <option key={evt.id} value={evt.id}>{evt.title}</option>
          ))}
        </select>
        
        <label>
        Quantity:
        </label>
        <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default ReservationFormPage;
