import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventFormPage = () => {
  const { id } = useParams(); // if id exists => editing
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    price: 0,
    capacity: 0
  });

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const res = await axios.get(`http://localhost:5161/api/events/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          // Format date for datetime-local input
          const eventData = res.data;
          if (eventData.date) {
            eventData.date = eventData.date.substring(0, 16);
          }
          setForm(eventData);
        } catch (err) {
          console.error(err);
          if (err.response && err.response.status === 401) {
            alert("Non autorisé. Veuillez vous reconnecter.");
            navigate('/login');
          }
        }
      };

      fetchEvent();
    }
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (id) {
        await axios.put(`http://localhost:5161/api/events/${id}`, form, config);
      } else {
        await axios.post(`http://localhost:5161/api/events`, form, config);
      }
      navigate('/events');
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>{id ? 'Modifier l\'Événement' : 'Créer un Événement'}</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Titre</label>
            <input 
              name="title" 
              placeholder="Titre de l'événement" 
              value={form.title} 
              onChange={handleChange} 
              required 
              style={styles.input}
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea 
              name="description" 
              placeholder="Description de l'événement" 
              value={form.description} 
              onChange={handleChange} 
              required 
              style={styles.textarea}
              rows="4"
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date et Heure</label>
            <input 
              type="datetime-local" 
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              required 
              style={styles.input}
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Prix ($)</label>
              <input 
                type="number" 
                name="price" 
                placeholder="0" 
                value={form.price} 
                onChange={handleChange} 
                required 
                min="0"
                step="0.01"
                style={styles.input}
                disabled={isLoading}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Capacité</label>
              <input 
                type="number" 
                name="capacity" 
                placeholder="0" 
                value={form.capacity} 
                onChange={handleChange} 
                required 
                min="1"
                style={styles.input}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={() => navigate('/events')} 
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
    maxWidth: '600px',
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
  inputRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minWidth: '200px',
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
  textarea: {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
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
};

export default EventFormPage;