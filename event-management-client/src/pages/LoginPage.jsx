import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
      setError('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {token && <p>Token saved! ✅</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
