import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const userEmail = localStorage.getItem("userEmail");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalReservations: 0,
    upcomingEvents: 0,
    recentReservations: 0
  });

  const fetchUsers = async () => {
  if (role !== 'Admin') return;
  
  setIsLoadingUsers(true);
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5161/api/auth/users', config);
    setUsers(res.data);
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    setIsLoadingUsers(false);
  }
};

  
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false); 
  const [editingUser, setEditingUser] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);

  const fetchAvailableRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5161/api/auth/available-roles', config);
      setAvailableRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const changeUserRole = async (email, newRole) => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    await axios.post('http://localhost:5161/api/auth/assign-role', 
      null, 
      { 
        ...config,
        params: { email, role: newRole }
      }
    );
    
    await fetchUsers();
    setEditingUser(null);
    alert('Rôle modifié avec succès');
  } catch (err) {
    console.error("Error changing role:", err);
    alert('Erreur lors de la modification du rôle');
  }
};

  useEffect(() => {
    const fetchDashboardData = async () => {
      
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        if (role === 'Admin') {
        await fetchUsers();
        await fetchAvailableRoles();
      }
        const eventsRes = await axios.get('http://localhost:5161/api/events', config);
        const allEvents = eventsRes.data;
        setRecentEvents(allEvents.slice(0, 3)); 
        
        
        if (role === 'Admin') {
          const reservationsRes = await axios.get('http://localhost:5161/api/reservation/', config);
          const allReservations = reservationsRes.data;
          
          setStats({
            totalEvents: allEvents.length,
            totalReservations: allReservations.length,
            upcomingEvents: allEvents.filter(event => new Date(event.date) > new Date()).length,
            recentReservations: allReservations.filter(res => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(res.reservationDate) > weekAgo;
            }).length
          });
        } else if (role === 'Organizer') {
          const myEvents = allEvents.filter(event => event.organizerEmail === userEmail);
          const reservationsRes = await axios.get('http://localhost:5161/api/reservation/', config);
          const allReservations = reservationsRes.data;
          const myEventReservations = allReservations.filter(res => 
            myEvents.some(event => event.id === res.eventId)
          );
          
          setStats({
            totalEvents: myEvents.length,
            totalReservations: myEventReservations.length,
            upcomingEvents: myEvents.filter(event => new Date(event.date) > new Date()).length,
            recentReservations: myEventReservations.filter(res => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(res.reservationDate) > weekAgo;
            }).length
          });
        } else {
          
          const reservationsRes = await axios.get('http://localhost:5161/api/reservation/my', config);
          const myReservations = reservationsRes.data;
          
          setStats({
            totalEvents: allEvents.length,
            totalReservations: myReservations.length,
            upcomingEvents: myReservations.filter(res => new Date(res.event.date) > new Date()).length,
            recentReservations: myReservations.filter(res => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(res.reservationDate) > weekAgo;
            }).length
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchDashboardData();
  }, [role, userEmail]);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tableau de Bord</h1>
        <div style={styles.userInfo}>
          <p style={styles.welcomeMessage}>Bienvenue, <strong>{userEmail}</strong></p>
          <div style={styles.roleBadge}>{role}</div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎫</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalEvents}</h3>
            <p style={styles.statLabel}>Événements{role !== 'Admin' && role !== 'Organizer' ? ' Disponibles' : ' Totaux'}</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalReservations}</h3>
            <p style={styles.statLabel}>{role === 'User' ? ' Mes' : ''}Réservations</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.upcomingEvents}</h3>
            <p style={styles.statLabel}>Événements à Venir</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🆕</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.recentReservations}</h3>
            <p style={styles.statLabel}>Réservations Récentes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Actions Rapides</h2>
        <div style={styles.actionsGrid}>
          {(role === 'Organizer' || role === 'Admin') && (
            <button 
              onClick={() => navigate('/events/new')} 
              style={styles.actionButton}
            >
              <span style={styles.actionIcon}>➕</span>
              <span>Créer un Événement</span>
            </button>
          )}
          
          <button 
            onClick={() => navigate('/events')} 
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>🎫</span>
            <span>Voir tous les Événements</span>
          </button>
          
          <button 
            onClick={() => navigate('/reservations')} 
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>📋</span>
            <span>{role === 'User' ? ' Mes' : ''} Réservations</span>
          </button>
          
          {(role === 'Organizer' || role === 'Admin') && (
            <button 
              onClick={() => navigate('/reservations')} 
              style={styles.actionButton}
            >
              <span style={styles.actionIcon}>👥</span>
              <span>Voir toutes les Réservations</span>
            </button>
          )}
        </div>
      </div>

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Événements Récents</h2>
          <div style={styles.eventsGrid}>
            {recentEvents.map(event => (
              <div key={event.id} style={styles.eventCard}>
                <h3 style={styles.eventTitle}>{event.title}</h3>
                <p style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p style={styles.eventDescription}>{event.description}</p>
                <button 
                  onClick={() => navigate(`/events/`)}
                  style={styles.viewButton}
                >
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
{role === 'Admin' && (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>Gestion des Utilisateurs</h2>
    {isLoadingUsers ? (
      <p>Chargement des utilisateurs...</p>
    ) : users.length > 0 ? (
      <div style={styles.tableContainer}>
        <table style={styles.usersTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Rôle</th>
              <th style={styles.tableHeader}>Date d'inscription</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={styles.tableCell}>{user.email}</td>
                <td style={styles.tableCell}>
                  {editingUser === user.id ? (
                    <select 
                      defaultValue={user.role}
                      onChange={(e) => changeUserRole(user.email, e.target.value)}
                      style={styles.roleSelect}
                    >
                      {availableRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={user.role === 'Admin' ? styles.adminBadge : 
                                user.role === 'Organizer' ? styles.organizerBadge : styles.userBadge}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td style={styles.tableCell}>
                  {editingUser === user.id ? (
                    <button 
                      onClick={() => setEditingUser(null)}
                      style={styles.cancelButton}
                    >
                      Annuler
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditingUser(user.id)}
                      style={styles.editButton}
                    >
                      ✏️ Modifier
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>Aucun utilisateur trouvé.</p>
    )}
  </div>
)}
      
    </div>
  );
};

const styles = {
  roleSelect: {
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #d1d5db',
},
editButton: {
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
},
cancelButton: {
  backgroundColor: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
},

  tableContainer: {
  overflowX: 'auto',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
},
usersTable: {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
},
tableHeader: {
  backgroundColor: '#4f46e5',
  color: 'white',
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600',
},
tableCell: {
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
},
adminBadge: {
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.8rem',
},
organizerBadge: {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.8rem',
},
userBadge: {
  backgroundColor: '#16a34a',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.8rem',
},

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
    fontSize: '2rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  welcomeMessage: {
    margin: 0,
    color: '#6b7280',
  },
  roleBadge: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    margin: '0 0 0.25rem 0',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    margin: 0,
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    color: '#1f2937',
    margin: '0 0 1.5rem 0',
    fontSize: '1.5rem',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  actionButton: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1.5rem 1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  actionIcon: {
    fontSize: '1.5rem',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
  },
  eventTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#1f2937',
  },
  eventDate: {
    margin: '0 0 1rem 0',
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  eventDescription: {
    margin: '0 0 1.5rem 0',
    color: '#4b5563',
    lineHeight: '1.5',
  },
  viewButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
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

export default DashboardPage;