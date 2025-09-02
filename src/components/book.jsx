import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Booking() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setError('Please select date and time.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5001/api/patients/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateTime: `${date}T${time}:00Z`, username: 'testuser' }), // ใช้ username จาก login
      });
      const data = await response.json();
      if (response.ok) {
        alert('Booking successful!');
        navigate('/patient-dashboard');
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Network error');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white text-blue-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Book Appointment</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default Booking;