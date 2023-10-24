import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './assets/header.css';

const Header = ({token, setToken}) => {
  const navigate = useNavigate()
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };
  return (
    <div className="Header">
      <nav>
        <Link to="/" className='button home-button'>Home</Link>
        {token && <Link onClick={handleLogout} to="/" className='button home-button'>Logout</Link>}
      </nav>
    </div>
  );
};

export default Header;
