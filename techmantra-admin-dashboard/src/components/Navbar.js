import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: 'linear-gradient(90deg, #1e3c72, #2a5298)', // cool blue gradient
        padding: '0.75rem 2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
      }}
    >
      <span
        className="navbar-brand"
        style={{
          color: '#ffffff',
          fontWeight: '700',
          fontSize: '1.6rem',
          letterSpacing: '1.2px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        TechMantra Admin
      </span>
      <div className="ms-auto">
        <button
          className="btn"
          onClick={handleLogout}
          style={{
            color: '#ffffff',
            border: 'none',
            backgroundColor: '#ff4b5c', // vibrant red-pink accent
            padding: '8px 20px',
            fontWeight: '500',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e8434f';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ff4b5c';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
