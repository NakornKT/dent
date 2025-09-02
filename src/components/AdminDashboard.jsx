import React, { useState, useEffect } from 'react';
import Report from './Report';

function AdminDashboard({ user }) {
  const [incomeSummary, setIncomeSummary] = useState({ day: 0, month: 0, year: 0 });
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState({ total: 0, arrived: 0, notArrived: 0 });
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/admin/patients`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setPatients(data);
        }
      } catch (error) {
        console.error('Fetch patients error:', error);
      }
      // Fetch other data
    };
    fetchData();
  }, []);

  const handleChangeRole = () => {};

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen">
      <nav className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-purple-600">Admin Dashboard</h2>
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
            <p className="text-lg mb-4">รายได้ทั้งหมด: รายวัน {incomeSummary.day}, รายเดือน {incomeSummary.month}, รายปี {incomeSummary.year}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-xl font-bold">ยอดทั้งหมด</p>
                <p className="text-2xl">{patients.total}</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-xl font-bold">มาแล้ว</p>
                <p className="text-2xl">{patients.arrived}</p>
              </div>
              <div className="bg-red-100 p-4 rounded">
                <p className="text-xl font-bold">ยังไม่มา</p>
                <p className="text-2xl">{patients.notArrived}</p>
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
                  <td className="border p-2">{patients.total}</td>
                </tr>
                <tr className="border">
                  <td className="border p-2">มาแล้ว</td>
                  <td className="border p-2">{patients.arrived}</td>
                </tr>
                <tr className="border">
                  <td className="border p-2">ยังไม่มา</td>
                  <td className="border p-2">{patients.notArrived}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-purple-600">จัดการ Role</h3>
            <button onClick={handleChangeRole} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600">เปลี่ยน Role</button>
          </div>
        </>
      )}

      {showReport && <Report userRole="admin" userId={user.userId} reportType={showReport ? 'appointment' : null} />}
    </div>
  );
}

export default AdminDashboard;