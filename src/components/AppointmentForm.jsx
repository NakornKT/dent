import React, { useState } from 'react';
import axios from 'axios';

function AppointmentForm({ patientId }) {
  const [formData, setFormData] = useState({
    appoint_date: '',
    appoint_time: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/appointments', { ...formData, patient_id: patientId })
      .then(response => alert('Appointment created!'))
      .catch(error => console.error('Error creating appointment:', error));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold">Book Appointment</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="date"
          value={formData.appoint_date}
          onChange={(e) => setFormData({ ...formData, appoint_date: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="time"
          value={formData.appoint_time}
          onChange={(e) => setFormData({ ...formData, appoint_time: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Book</button>
      </form>
    </div>
  );
}

export default AppointmentForm;