import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200">ToothsmilePlus Dental Clinic</Link>
        <nav>
          {user ? (
            <button onClick={onLogout} className="mr-4 text-white hover:text-gray-200">Logout</button>
          ) : (
            <Link to="/login" className="mr-4 text-white hover:text-gray-200">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;