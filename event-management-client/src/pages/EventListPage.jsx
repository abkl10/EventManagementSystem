import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventListPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5161/api/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div style={styles.container}>
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul style={styles.list}>
          {events.map(event => (
            <li key={event.id} style={styles.card}>
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Price:</strong> ${event.price}</p>
              <Link to={`/events/${event.id}`} style={styles.detailsLink}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  list: { listStyle: 'none', padding: 0 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px'
  },
  detailsLink: {
    textDecoration: 'none',
    color: '#007bff',
    marginTop: '1rem',
    display: 'inline-block'
  }
};

export default EventListPage;
