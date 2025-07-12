import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🎟️ Event Manager</h2>
      <ul style={styles.links}>
        <li><Link to="/events" style={styles.link}>Events</Link></li>
        <li><Link to="/reservations" style={styles.link}>Reservations</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
        <li><Link to="/register" style={styles.link}>Register</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#222',
    color: 'white'
  },
  logo: {
    margin: 0
  },
  links: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    margin: 0,
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  }
};

export default Navbar;
