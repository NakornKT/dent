import React, { useState, useEffect } from 'react';
import Report from './Report';

function StaffDashboard({ user }) {
  const [appointments, setAppointments] = useState({ total: 0, arrived: 0, notArrived: 0 });
  const [incomeSummary, setIncomeSummary] = useState({ day: 0, month: 0, year: 0 });
  const [patientSearch, setPatientSearch] = useState('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/staff/patients?userId=${user.userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setAppointments(data);
        }
      } catch (error) {
        console.error('Fetch patients error:', error);
      }
      // Fetch other data
    };
    fetchData();
  }, [user.userId]);

  const handleCheckIn = () => {};
  const handlePostpone = () => {};
  const handleConfirmPayment = () => {};

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-green-50 to-teal-50 min-h-screen">
      <nav className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-green-600">Staff Dashboard</h2>
        <button
          onClick={() => setShowReport(!showReport)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          {showReport ? 'ซ่อน Report' : 'แสดง Report'}
        </button>
      </nav>

      {!showReport && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <p className="text-lg mb-2">ชื่อ-นามสกุลพนักงาน: {user.fullName}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-xl font-bold">ยอดทั้งหมด</p>
                <p className="text-2xl">{appointments.total}</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-xl font-bold">มาแล้ว</p>
                <p className="text-2xl">{appointments.arrived}</p>
              </div>
              <div className="bg-red-100 p-4 rounded">
                <p className="text-xl font-bold">ยังไม่มา</p>
                <p className="text-2xl">{appointments.notArrived}</p>
              </div>
            </div>
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ประเภท</th>
                  <th className="border p-2">จำนวน</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="border p-2">ยอดทั้งหมด</td>
                  <td className="border p-2">{appointments.total}</td>
                </tr>
                <tr className="border">
                  <td className="border p-2">มาแล้ว</td>
                  <td className="border p-2">{appointments.arrived}</td>
                </tr>
                <tr className="border">
                  <td className="border p-2">ยังไม่มา</td>
                  <td className="border p-2">{appointments.notArrived}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-600">ตารางนัดหมาย</h3>
            {/* Table of appointments */}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-600">Check-in คนไข้</h3>
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="ชื่อหรือไอดีคนไข้"
              className="border p-2 w-full mb-2 rounded"
            />
            <button onClick={handleCheckIn} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Check-in</button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-600">เลื่อนนัด</h3>
            <button onClick={handlePostpone} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">เลื่อนนัด</button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-green-600">ยืนยันการชำระเงิน</h3>
            <button onClick={handleConfirmPayment} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">ยืนยันและออกใบเสร็จ</button>
          </div>
        </>
      )}

      {showReport && <Report userRole="staff" userId={user.userId} reportType={showReport ? 'appointment' : null} />}
    </div>
  );
}

export default StaffDashboard;