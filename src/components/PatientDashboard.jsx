import React, { useState, useEffect } from 'react';



function PatientDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/patients/dashboard?username=${encodeURIComponent(user.username)}`);
        const data = await response.json();
        console.log('Dashboard data:', data);

        if (response.ok) {
          setDashboardData(data.data || data); // ปรับตาม API จริง
        } else {
          setError(data.error || 'Failed to fetch dashboard');
        }
      } catch (err) {
        console.error(err);
        setError('Network error');
      }
    };

    fetchDashboard();
  }, [user]);

  if (error) return <p className="text-red-500 mt-4">{error}</p>;
  if (!dashboardData) return <p className="mt-4">Loading dashboard...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>
      <p><strong>Welcome:</strong> {dashboardData.fullName || dashboardData.username}</p>
      <p><strong>Role:</strong> {dashboardData.role}</p>
      <p><strong>User ID:</strong> {dashboardData.userId}</p>
      <p><strong>Birth Date:</strong> {dashboardData.birthDate ? new Date(dashboardData.birthDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Phone:</strong> {dashboardData.phone || 'N/A'}</p>
      <p><strong>Address:</strong> {dashboardData.address || 'N/A'}</p>
      <p><strong>Next Appointment:</strong> {dashboardData.appointmentDate ? new Date(dashboardData.appointmentDate).toLocaleString() : 'None'}</p>
      <p><strong>Status:</strong> {dashboardData.status || 'N/A'}</p>
    </div>
  );
}

export default PatientDashboard;