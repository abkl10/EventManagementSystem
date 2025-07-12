import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ReservationsPage from './pages/ReservationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import EventFormPage from './pages/EventFormPage';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/events" element={<EventListPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/edit/:id" element={<EventFormPage />} />
        <Route path="/dashboard" element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
