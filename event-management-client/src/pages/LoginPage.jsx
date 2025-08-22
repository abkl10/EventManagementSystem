import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5161/api/auth/login', form);

      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.email);
        localStorage.setItem('role', res.data.role);

        setError('');
        navigate('/dashboard'); 
      } else {
        setError('Invalid login response');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <i className="fas fa-calendar-alt" style={styles.logoIcon}></i>
          </div>
          <h1 style={styles.title}>EventManager Pro</h1>
          <p style={styles.subtitle}>Connectez-vous à votre espace</p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder="votre@email.com" 
              onChange={handleChange} 
              required 
              style={styles.input}
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Mot de passe</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Votre mot de passe" 
              onChange={handleChange} 
              required 
              style={styles.input}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            style={isLoading ? {...styles.button, ...styles.buttonLoading} : styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.loadingSpinner}></div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
        
        {token && (
          <div style={styles.successMessage}>
            <i className="fas fa-check-circle" style={styles.successIcon}></i>
            <span>Connexion réussie! Redirection...</span>
          </div>
        )}
        
        {error && (
          <div style={styles.errorMessage}>
            <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
            <span>{error}</span>
          </div>
        )}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Mot de passe oublié? <a href="/forgot-password" style={styles.link}>Réinitialiser</a>
          </p>
          <p style={styles.footerText}>
            Nouveau utilisateur? <a href="/register" style={styles.link}>Créer un compte</a>
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
  loginCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
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
  inputFocus: {
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
    outline: 'none',
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

export default LoginPage;