import React, { useState, useEffect } from "react";

function DoctorDashboard({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:5001/api/patients/dashboard?username=${user.username}`);
      const json = await res.json();
      setData(json);
    };
    if (user) fetchData();
  }, [user]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>ID:</strong> {user.userId}</p>
      {data.appointment && (
        <>
          <p><strong>Patient Appointment Date:</strong> {new Date(data.appointment.dateTime).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {data.appointment.status}</p>
        </>
      )}
    </div>
  );
}

export default DoctorDashboard;
