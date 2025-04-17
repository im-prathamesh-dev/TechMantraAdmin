import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const ADMIN_USERNAME = 'Admin';
  const ADMIN_PASSWORD = 'TechMantra@2025';

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('token', 'dummy-token');
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="sparkle-overlay" />
      <div className="login-card-wrapper">
        <h1 className="techmantra-heading">TechMantra Admin Dashboard</h1>
        <form className="card p-4 shadow mx-auto" onSubmit={handleLogin} style={{ width: '300px' }}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn w-100 fw-bold" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
