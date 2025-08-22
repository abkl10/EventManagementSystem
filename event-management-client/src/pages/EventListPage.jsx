import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5161/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;

    try {
      await axios.delete(`http://localhost:5161/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎫 Tous les Événements</h1>
        
        {token && role === 'Organizer' && (
          <button 
            onClick={() => navigate('/events/new')} 
            style={styles.createButton}
          >
            + Créer un Nouvel Événement
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>
          <h3>Aucun événement disponible</h3>
          <p>Il n'y a pas d'événements à afficher pour le moment.</p>
          {token && role === 'Organizer' && (
            <button 
              onClick={() => navigate('/events/new')} 
              style={styles.createButton}
            >
              Créer votre premier événement
            </button>
          )}
        </div>
      ) : (
        <div style={styles.eventsGrid}>
          {events.map(event => (
            <div key={event.id} style={styles.eventCard}>
              <div style={styles.eventHeader}>
                <h3 style={styles.eventTitle}>{event.title}</h3>
                <div style={styles.eventPrice}>${event.price}</div>
              </div>
              
              <p style={styles.eventDescription}>{event.description}</p>
              
              <div style={styles.eventDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>📅</span>
                  <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>👥</span>
                  <span>Capacité: {event.capacity} personnes</span>
                </div>
              </div>

              {token && role === 'Organizer' && (
                <div style={styles.actions}>
                  <button 
                    onClick={() => navigate(`/events/edit/${event.id}`)}
                    style={styles.editButton}
                  >
                    ✏️ Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)} 
                    style={styles.deleteButton}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    color: '#1f2937',
    margin: 0,
  },
  createButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #e5e7eb',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  eventTitle: {
    margin: '0',
    fontSize: '1.25rem',
    color: '#1f2937',
    flex: 1,
  },
  eventPrice: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    marginLeft: '1rem',
  },
  eventDescription: {
    color: '#6b7280',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.5',
  },
  eventDetails: {
    marginBottom: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    color: '#4b5563',
  },
  detailIcon: {
    marginRight: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: 1,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
};

const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default EventListPage;