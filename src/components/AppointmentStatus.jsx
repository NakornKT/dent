import React from 'react';
import axios from 'axios';

function AppointmentStatus({ appointments }) {
  const confirmAppointment = (appointId) => {
    axios.put(`http://localhost:3001/appointments/${appointId}/confirm`)
      .then(() => alert('Appointment confirmed!'))
      .catch(error => console.error('Error confirming appointment:', error));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold">Appointment Status</h3>
      <ul className="mt-4 space-y-2">
        {appointments.map(app => (
          <li key={app.appoint_id} className="p-2 bg-blue-100 rounded flex justify-between items-center">
            <span>{app.appoint_date} {app.appoint_time} - {app.appoint_status}</span>
            {app.appoint_status === 'PENDING' && (
              <button
                onClick={() => confirmAppointment(app.appoint_id)}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Confirm
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentStatus;