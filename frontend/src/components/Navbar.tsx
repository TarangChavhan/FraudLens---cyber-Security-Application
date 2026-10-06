import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wider">FraudLens</Link>
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Register</Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.name} ({user.role})</span>
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-sm">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
