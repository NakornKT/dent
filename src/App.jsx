// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import PromotionSection from './components/PromotionSection';
import MapSection from './components/MapSection';
import ReviewSection from './components/ReviewSection';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // โหลด user จาก localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ฟังก์ชัน login
  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/patient-dashboard');
  };
  

  // ฟังก์ชัน logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <div>
          <Link to="/" className="mr-4 text-white hover:underline">Home</Link>
          {user && user.role === 'patient' && (
            <Link to="/patient-dashboard" className="text-white hover:underline">Dashboard</Link>
          )}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 p-2 rounded">Logout</button>
          ) : (
            <>
              <Link to="/login" className="bg-green-500 p-2 rounded mr-2">Login</Link>
              <Link to="/register" className="bg-blue-500 p-2 rounded">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <main className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PromotionSection />
                <MapSection />
                <ReviewSection />
              </>
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/patient-dashboard"
            element={
              user ? <PatientDashboard user={user} /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;