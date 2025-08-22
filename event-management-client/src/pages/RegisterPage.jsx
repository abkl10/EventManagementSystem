import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ''});
    }
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }
    
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Le format de l'email est invalide";
    }
    
    if (!form.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (form.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5161/api/auth/register', form);
      setMessage(res.data);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setMessage(err.response?.data || "Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerCard}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <i className="fas fa-calendar-alt" style={styles.logoIcon}></i>
          </div>
          <h1 style={styles.title}>Créer un compte</h1>
          <p style={styles.subtitle}>Rejoignez EventManager Pro</p>
        </div>
        
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="fullName" style={styles.label}>Nom complet</label>
            <input 
              type="text" 
              id="fullName"
              name="fullName" 
              placeholder="Votre nom complet" 
              onChange={handleChange} 
              required 
              style={errors.fullName ? {...styles.input, ...styles.inputError} : styles.input}
              disabled={isLoading}
            />
            {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder="votre@email.com" 
              onChange={handleChange} 
              required 
              style={errors.email ? {...styles.input, ...styles.inputError} : styles.input}
              disabled={isLoading}
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Mot de passe</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Créez un mot de passe" 
              onChange={handleChange} 
              required 
              style={errors.password ? {...styles.input, ...styles.inputError} : styles.input}
              disabled={isLoading}
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            <div style={styles.passwordHint}>Le mot de passe doit contenir au moins 6 caractères</div>
          </div>
          
          <button 
            type="submit" 
            style={isLoading ? {...styles.button, ...styles.buttonLoading} : styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.loadingSpinner}></div>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>
        
        {message && (
          <div style={message.includes('échec') || message.includes('failed') ? styles.errorMessage : styles.successMessage}>
            <i className={message.includes('échec') || message.includes('failed') ? "fas fa-exclamation-circle" : "fas fa-check-circle"} 
               style={message.includes('échec') || message.includes('failed') ? styles.errorIcon : styles.successIcon}></i>
            <span>{message}</span>
          </div>
        )}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Vous avez déjà un compte? <a href="/login" style={styles.link}>Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  registerCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
  },
  logoSection: {
    marginBottom: '30px',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px',
  },
  logoIcon: {
    color: 'white',
    fontSize: '32px',
  },
  title: {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputError: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)',
  },
  inputFocus: {
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
    outline: 'none',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '4px',
    display: 'block',
  },
  passwordHint: {
    color: '#6b7280',
    fontSize: '12px',
    marginTop: '4px',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px',
  },
  buttonLoading: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '20px',
    fontSize: '14px',
  },
  successIcon: {
    marginRight: '8px',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '20px',
    fontSize: '14px',
  },
  errorIcon: {
    marginRight: '8px',
  },
  footer: {
    marginTop: '30px',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px',
  },
  footerText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '8px 0',
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
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

export default RegisterPage;