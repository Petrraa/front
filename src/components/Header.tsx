import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/trips">TravelConnect</Link>
        <div>
          {user ? (
            <>
              <span className="me-3">Hi, {user.name}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary me-2 btn-sm" to="/login">Login</Link>
              <Link className="btn btn-outline-secondary btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
