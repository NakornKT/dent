import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [showPostponeForm, setShowPostponeForm] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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

  // Generate available appointment slots based on the day
  const generateAppointmentSlots = (date) => {
    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const slots = [];
    const baseDate = new Date(date);

    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
      let currentTime = new Date(baseDate);
      currentTime.setHours(13, 0, 0, 0); // Start at 13:00
      const endTime = new Date(baseDate);
      endTime.setHours(19, 40, 0, 0); // End at 19:40

      while (currentTime <= endTime) {
        slots.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + 20); // Increment by 20 minutes
      }
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Saturday or Sunday
      let currentTime = new Date(baseDate);
      currentTime.setHours(10, 0, 0, 0); // Start at 10:00
      const endTime = new Date(baseDate);
      endTime.setHours(17, 40, 0, 0); // End at 17:40

      while (currentTime <= endTime) {
        slots.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + 20); // Increment by 20 minutes
      }
    }
    return slots;
  };

  const handleConfirmAppointment = (apptId) => {
    console.log('Confirming appointment ID:', apptId);
    // Implement API call to confirm appointment
    // await fetch(`/api/patients/appointments/confirm/${apptId}`, { method: 'POST' });
  };

  const handlePostponeAppointment = async (apptId) => {
    if (newAppointmentDate) {
      console.log('Postponing appointment ID:', apptId, 'to', newAppointmentDate);
      // Implement API call to postpone appointment
      // await fetch(`/api/patients/appointments/postpone/${apptId}`, {
      //   method: 'POST',
      //   body: JSON.stringify({ newDate: newAppointmentDate }),
      // });
      setShowPostponeForm(false);
      setNewAppointmentDate('');
      setSelectedAppointment(null);
    }
  };

  const handleCancelAppointment = (apptId) => {
    console.log('Cancelling appointment ID:', apptId);
    // Implement API call to cancel appointment
    // await fetch(`/api/patients/appointments/cancel/${apptId}`, { method: 'DELETE' });
  };

  const handleBookAppointment = async () => {
    if (selectedAppointment) {
      console.log('Booking appointment at:', selectedAppointment);
      // Implement API call to book appointment
      // await fetch(`/api/patients/appointments/book`, {
      //   method: 'POST',
      //   body: JSON.stringify({ userId: user.userId, dateTime: selectedAppointment }),
      // });
      setSelectedAppointment(null);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboardData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Patient Dashboard</h2>
        <p className="text-lg mb-2">ชื่อ-นามสกุล: {dashboardData.fullName}</p>
        <p className="text-lg mb-4">ไอดีคนไข้: {dashboardData.userId}</p>

        {/* Appointment Booking Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">จองนัดหมาย</h3>
          <input
            type="date"
            value={selectedAppointment ? new Date(selectedAppointment).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const slots = generateAppointmentSlots(e.target.value);
              setSelectedAppointment(slots[0] || null);
              setNewAppointmentDate('');
            }}
            className="border p-2 mb-2 rounded w-full"
          />
          {selectedAppointment && (
            <select
              value={new Date(selectedAppointment).toISOString()}
              onChange={(e) => setSelectedAppointment(new Date(e.target.value))}
              className="border p-2 mb-2 rounded w-full"
            >
              {generateAppointmentSlots(new Date(selectedAppointment).toISOString().split('T')[0]).map((slot) => (
                <option key={slot.toISOString()} value={slot.toISOString()}>
                  {slot.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleBookAppointment}
            disabled={!selectedAppointment}
            className="bg-green-500 text-white p-2 rounded mr-2 disabled:bg-gray-300 hover:bg-green-600"
          >
            จองนัด
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">วันที่นัดหมาย</h3>
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <div key={appt.id} className="border-b py-4">
              <p>วันที่: {new Date(appt.dateTime).toLocaleString('th-TH')}</p>
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
                  onClick={() => {
                    setShowPostponeForm(true);
                    setSelectedAppointment(new Date(appt.dateTime));
                    setNewAppointmentDate(new Date(appt.dateTime).toISOString());
                  }}
                  className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600"
                >
                  เลื่อนนัด
                </button>
                {showPostponeForm && selectedAppointment && (
                  <div className="mt-2">
                    <select
                      value={newAppointmentDate}
                      onChange={(e) => setNewAppointmentDate(e.target.value)}
                      className="border p-2 mr-2 rounded"
                    >
                      {generateAppointmentSlots(new Date(selectedAppointment).toISOString().split('T')[0]).map((slot) => (
                        <option key={slot.toISOString()} value={slot.toISOString()}>
                          {slot.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handlePostponeAppointment(appt.id)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
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
              <p>วันที่: {new Date(receipt.date).toLocaleString('th-TH')}</p>
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