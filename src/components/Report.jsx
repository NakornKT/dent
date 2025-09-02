import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Report({ user }) {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('self'); // self, all, specific
  const [doctorUsername, setDoctorUsername] = useState(user.username);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let url = 'http://localhost:5000/api/reports';
    if (user.role === 'doctor') {
      url += `?username=${user.username}&role=doctor`;
    } else if (user.role === 'staff') {
      url += `?role=staff`;
    } else if (user.role === 'admin') {
      url += `?role=admin`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => setError('Failed to fetch reports'));
  }, [user.role, user.username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Reports</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {user.role === 'staff' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
            <option value="all">All Doctors</option>
            <option value="specific">Specific Doctor</option>
          </select>
          {viewType === 'specific' && (
            <input
              type="text"
              value={doctorUsername}
              onChange={(e) => setDoctorUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mt-2"
              placeholder="Enter doctor username"
            />
          )}
        </div>
      )}

      {records.length > 0 ? (
        <ul className="space-y-4">
          {records.map((record) => (
            <li key={record.id} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>Patient ID:</strong> {record.patientId}</p>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Procedures:</strong> {record.procedures}</p>
              <p><strong>Cost:</strong> {record.cost} THB</p>
              <p><strong>Status:</strong> {record.paymentStatus}</p>
              <p><strong>Doctor:</strong> {record.doctor.fullName}</p>
              <p><strong>Recorded at:</strong> {new Date(record.recordedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
}

export default Report;