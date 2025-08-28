import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  return (
    <div style={styles.container}>
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>EventManager Pro</h1>
          <p style={styles.subtitle}>
            Découvrez, organisez et réservez des événements exceptionnels
          </p>
          <div style={styles.ctaContainer}>
            {token ? (
              <>
                <p style={styles.welcomeText}>Bon retour, {userEmail}!</p>
                <div style={styles.buttonGroup}>
                  <button 
                    onClick={() => navigate('/events')}
                    style={styles.primaryButton}
                  >
                    Voir les Événements
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    style={styles.secondaryButton}
                  >
                    Mon Tableau de Bord
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => navigate('/register')}
                  style={styles.primaryButton}
                >
                  Commencer Maintenant
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  style={styles.secondaryButton}
                >
                  Se Connecter
                </button>
              </div>
            )}
          </div>
        </div>
        
      </header>
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Pourquoi choisir EventManager Pro ?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎫</div>
            <h3>Événements Diversifiés</h3>
            <p>Découvrez une large gamme d'événements correspondant à vos centres d'intérêt.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h3>Réservation Rapide</h3>
            <p>Réservez vos places en quelques clics avec notre processus simplifié.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔐</div>
            <h3>Sécurité Garantie</h3>
            <p>Vos données et transactions sont protégées par les meilleures standards de sécurité.</p>
          </div>
        </div>
      </section>
      <section style={styles.ctaSection}>
        <h2>Prêt à vivre des expériences inoubliables ?</h2>
        <p>Rejoignez notre communauté dès aujourd'hui et ne manquez plus jamais un événement.</p>
        {!token && (
          <button 
            onClick={() => navigate('/register')}
            style={styles.ctaButton}
          >
            Créer un Compte Gratuit
          </button>
        )}
      </section>
      <footer style={styles.footer}>
        <p>&copy; 2025 EventManager Pro. Tous droits réservés.</p>
        
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4rem 2rem',
    backgroundColor: '#f8fafc',
    minHeight: '500px',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  welcomeText: {
    fontSize: '1.2rem',
    color: '#4b5563',
    marginBottom: '1.5rem',
  },
  ctaContainer: {
    marginTop: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    fontSize: '10rem',
    opacity: '0.8',
  },
  features: {
    padding: '4rem 2rem',
    backgroundColor: 'white',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#1f2937',
    marginBottom: '3rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  
  ctaSection: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f8fafc',
  },
  ctaButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '2rem',
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
  },

};

export default Home;