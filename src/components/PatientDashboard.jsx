import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [showPostponeForm, setShowPostponeForm] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/patients/dashboard?username=${user.username}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
        } else {
          setError(data.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Network error. Please try again.');
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/patients/appointments?userId=${user.userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (response.ok) {
          setAppointments(data.appointments || []);
        }
      } catch (error) {
        console.error('Fetch appointments error:', error);
      }
    };

    const fetchReceipts = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/patients/receipts?userId=${user.userId}&status=completed`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (response.ok) {
          setReceipts(data.receipts || []);
        }
      } catch (error) {
        console.error('Fetch receipts error:', error);
      }
    };

    if (user && user.username) {
      fetchDashboardData();
      fetchAppointments();
      fetchReceipts();
    }
  }, [user]);

  const handleConfirmAppointment = (apptId) => {
    console.log('Confirming appointment ID:', apptId);
    // Example API call
    // await fetch(`/api/patients/appointments/confirm/${apptId}`, { method: 'POST' });
  };

  const handlePostponeAppointment = async (apptId) => {
    if (newAppointmentDate) {
      console.log('Postponing appointment ID:', apptId, 'to', newAppointmentDate);
      // Example API call
      // await fetch(`/api/patients/appointments/postpone/${apptId}`, { method: 'POST', body: JSON.stringify({ newDate: newAppointmentDate }) });
      setShowPostponeForm(false);
      setNewAppointmentDate('');
    }
  };

  const handleCancelAppointment = (apptId) => {
    console.log('Cancelling appointment ID:', apptId);
    // Example API call
    // await fetch(`/api/patients/appointments/cancel/${apptId}`, { method: 'DELETE' });
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboardData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Patient Dashboard</h2>
        <p className="text-lg mb-2">ชื่อ-นามสกุล: {dashboardData.fullName}</p>
        <p className="text-lg mb-4">ไอดีคนไข้: {dashboardData.userId}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">วันที่นัดหมาย</h3>
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <div key={appt.id} className="border-b py-4">
              <p>วันที่: {new Date(appt.dateTime).toLocaleString()}</p>
              <p>สถานะ: {appt.status}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleConfirmAppointment(appt.id)}
                  disabled={new Date(appt.dateTime) - new Date() > 86400000}
                  className="bg-green-500 text-white p-2 rounded mr-2 disabled:bg-gray-300 hover:bg-green-600"
                >
                  ยืนยันนัด
                </button>
                <button
                  onClick={() => setShowPostponeForm(true)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600"
                >
                  เลื่อนนัด
                </button>
                {showPostponeForm && (
                  <div className="mt-2">
                    <input
                      type="datetime-local"
                      value={newAppointmentDate}
                      onChange={(e) => setNewAppointmentDate(e.target.value)}
                      className="border p-2 mr-2 rounded"
                    />
                    <button onClick={() => handlePostponeAppointment(appt.id)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                      ยืนยันเลื่อนนัด
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleCancelAppointment(appt.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  ยกเลิกนัด
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>ไม่มีวันที่นัดหมาย</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">ใบเสร็จชำระเงินย้อนหลัง (สถานะเสร็จสมบูรณ์)</h3>
        {receipts.length > 0 ? (
          receipts.map((receipt) => (
            <div key={receipt.id} className="border-b py-4">
              <p>วันที่: {new Date(receipt.date).toLocaleString()}</p>
              <p>ยอด: {receipt.amount} บาท</p>
              <p>สถานะ: เสร็จสมบูรณ์</p>
            </div>
          ))
        ) : (
          <p>ไม่มีใบเสร็จย้อนหลัง</p>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;