import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token');

  const fetchReservations = async () => {
    try {
      const res = await axios.get('http://localhost:5161/api/reservation', {
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
      fetchReservations(); // refresh the list
    } catch (err) {
      console.error('Error deleting reservation:', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <ul>
          {reservations.map(res => (
            <li key={res.id}>
              📅 {new Date(res.reservationDate).toLocaleString()} – 🎫 Event ID: {res.eventId} – Qty: {res.quantity}
              <button onClick={() => handleDelete(res.id)} style={{ marginLeft: '1rem', color: 'red' }}>
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
