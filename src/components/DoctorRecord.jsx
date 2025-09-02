import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorRecord({ user }) {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [doctorUsername, setDoctorUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [procedures, setProcedures] = useState('');
  const [cost, setCost] = useState('');
  const [recordId, setRecordId] = useState(null); // สำหรับการแก้ไข
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (patientId) {
      fetch(`http://localhost:5000/api/treatment-records/${patientId}`)
        .then(res => res.json())
        .then(data => setRecords(data))
        .catch(err => setError('Failed to fetch records'));
    }
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !doctorUsername || !password || !description || !procedures || !cost) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/record-treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, doctorUsername, password, description, procedures, cost, recordId }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(`Treatment ${recordId ? 'updated' : 'recorded'} by Dr. ${data.doctorName}`);
        setError('');
        setRecordId(null);
        setPatientId('');
        setDoctorUsername(user.username);
        setPassword('');
        setDescription('');
        setProcedures('');
        setCost('');
        fetch(`http://localhost:5000/api/treatment-records/${patientId}`)
          .then(res => res.json())
          .then(data => setRecords(data));
      } else {
        setError(data.error || 'Recording failed');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  const handleEdit = (record) => {
    setRecordId(record.id);
    setPatientId(record.patientId);
    setDescription(record.description);
    setProcedures(record.procedures);
    setCost(record.cost);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Record Treatment</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter patient ID (e.g., 68-0001)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Username</label>
          <input
            type="text"
            value={doctorUsername}
            onChange={(e) => setDoctorUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter doctor username"
            required
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter doctor password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter treatment description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Procedures</label>
          <input
            type="text"
            value={procedures}
            onChange={(e) => setProcedures(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter procedures (e.g., Cleaning, Filling)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cost (THB)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter total cost"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 font-semibold"
        >
          {recordId ? 'Update Treatment' : 'Record Treatment'}
        </button>
      </form>

      <h3 className="text-2xl font-bold text-gray-700 mb-4">Treatment Records</h3>
      {records.length > 0 ? (
        <ul className="space-y-4">
          {records.map((record) => (
            <li key={record.id} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Procedures:</strong> {record.procedures}</p>
              <p><strong>Cost:</strong> {record.cost} THB</p>
              <p><strong>Recorded by:</strong> {record.doctor.fullName} on {new Date(record.recordedAt).toLocaleDateString()}</p>
              {user.role === 'doctor' && user.username === record.doctor.username && (
                <button
                  onClick={() => handleEdit(record)}
                  className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No records found for this patient.</p>
      )}
    </div>
  );
}

export default DoctorRecord;