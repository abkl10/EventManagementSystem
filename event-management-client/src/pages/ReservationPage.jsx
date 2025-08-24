import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const endpoint = role === 'Admin'
        ? 'http://localhost:5161/api/reservation/'
        : 'http://localhost:5161/api/reservation/my';

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) return;
    
    try {
      await axios.delete(`http://localhost:5161/api/reservation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReservations(); 
    } catch (err) {
      console.error('Error deleting reservation:', err);
      alert('Erreur lors de la suppression de la réservation');
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.accessDenied}>
          <h2>Accès non autorisé</h2>
          <p>Veuillez vous connecter pour accéder à vos réservations.</p>
          <button 
            onClick={() => navigate('/login')} 
            style={styles.primaryButton}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {role === 'Admin' ? '📋 Toutes les Réservations' : '📋 Mes Réservations'}
        </h1>
        {token && (
        <button 
          onClick={() => navigate('/reservations/new')} 
          style={styles.createButton}
        >
          ➕ Nouvelle Réservation
        </button>
        )}
      </div>

      {reservations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>
          <h3>Aucune réservation</h3>
          <p>Vous n'avez pas encore de réservations.</p>
          <button 
            onClick={() => navigate('/reservations/new')} 
            style={styles.createButton}
          >
            Créer une réservation
          </button>
        </div>
      ) : (
        <div style={styles.reservationsGrid}>
          {reservations.map(res => (
            <div key={res.id} style={styles.reservationCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.eventTitle}>{res.event.title}</h3>
                <div style={styles.quantityBadge}>
                  {res.quantity} place{res.quantity > 1 ? 's' : ''}
                </div>
              </div>
              
              <div style={styles.eventDate}>
                <span style={styles.dateIcon}>📅</span>
                {new Date(res.event.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              {role === 'Admin' && res.user && (
                <div style={styles.userInfo}>
                  <span style={styles.userIcon}>👤</span>
                  <span>{res.user.email}</span>
                </div>
              )}
              
              <div style={styles.reservationDetails}>
                <div style={styles.detailItem}>
                  <strong>Prix unitaire:</strong> ${res.event.price}
                </div>
                <div style={styles.detailItem}>
                  <strong>Total:</strong> ${(res.event.price * res.quantity).toFixed(2)}
                </div>
                <div style={styles.detailItem}>
                  <strong>Réservé le:</strong> {new Date(res.reservationDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div style={styles.actions}>
                <button 
                  onClick={() => navigate(`/reservations/${res.id}/edit`)} 
                  style={styles.editButton}
                >
                  ✏️ Modifier
                </button>
                <button 
                  onClick={() => handleDelete(res.id)} 
                  style={styles.deleteButton}
                >
                  ❌ Supprimer
                </button>
              </div>
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
  accessDenied: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    maxWidth: '500px',
    margin: '2rem auto',
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
    whiteSpace: 'nowrap',
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
  reservationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #e5e7eb',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  eventTitle: {
    margin: '0',
    fontSize: '1.2rem',
    color: '#1f2937',
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    marginLeft: '1rem',
  },
  eventDate: {
    display: 'flex',
    alignItems: 'center',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  dateIcon: {
    marginRight: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    color: '#6b7280',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  userIcon: {
    marginRight: '0.5rem',
  },
  reservationDetails: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
    marginBottom: '1.5rem',
  },
  detailItem: {
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
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

export default ReservationPage;