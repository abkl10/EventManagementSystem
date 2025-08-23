import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationFormPage = () => {
  const { id } = useParams(); // pour l'édition si id existe
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    eventId: '',
    quantity: 1
  });

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
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user changes input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        setError('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>{id ? 'Modifier la Réservation' : 'Créer une Réservation'}</h2>
        
        {error && (
          <div style={styles.errorMessage}>
            <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Événement</label>
            <select 
              name="eventId" 
              value={form.eventId} 
              onChange={handleChange} 
              required 
              style={styles.select}
              disabled={isLoading}
            >
              <option value="">Sélectionnez un événement</option>
              {events.map(evt => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} - {new Date(evt.date).toLocaleDateString('fr-FR')}
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Quantité</label>
            <input 
              type="number" 
              name="quantity" 
              placeholder="Quantité" 
              value={form.quantity} 
              onChange={handleChange} 
              required 
              min="1"
              style={styles.input}
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={() => navigate('/reservations')} 
              style={styles.cancelButton}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              style={isLoading ? {...styles.submitButton, ...styles.loadingButton} : styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Traitement...' : (id ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    padding: '2rem 1rem',
    backgroundColor: '#f5f7fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    color: '#1f2937',
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  select: {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loadingButton: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '14px',
  },
  errorIcon: {
    marginRight: '8px',
  },
};

export default ReservationFormPage;