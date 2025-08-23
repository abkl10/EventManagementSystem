import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');


  const fetchReservations = async () => {
  try {
    const endpoint = role === 'Admin'
      ? 'http://localhost:5161/api/reservation/'
      : 'http://localhost:5161/api/reservation/my';

    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReservations(res.data);
  } catch (err) {
    console.error('Error fetching reservations:', err);
  }
};


  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5161/api/reservation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReservations(); 
      
    } catch (err) {
      console.error('Error deleting reservation:', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      
      <h2> {role === 'Admin' ? 'All Reservations' : 'My Reservations'}</h2>
      {token  && (
      <button onClick={() => navigate('/reservations/new')} style={{ marginBottom: '1rem' }}>
        ➕ New Reservation
      </button>
      )}
      {reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <ul>
          {reservations.map(res => (
          <li key={res.id}>
            📅 {new Date(res.event.date).toLocaleDateString()} – 🎫 {res.event.title} ({res.quantity} place{res.quantity > 1 ? 's' : ''})
            {role === 'Admin' && res.user && (
              <> – 👤 {res.user.email}</>
            )}
            <button onClick={() => navigate(`/reservations/${res.id}/edit`)} style={{ marginLeft: '1rem' }}>
              ✏️ Edit
            </button>
            <button onClick={() => handleDelete(res.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>
              ❌ Delete
            </button>
          </li>
        ))}
        </ul>
      )}

    </div>
  );
};

export default ReservationPage;
