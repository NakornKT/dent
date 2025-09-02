import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    birthDate: '',
    phone: '',
    address: '',
    chronicDisease: '',
    drugAllergy: '',
    foodAllergy: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(''); // ล้าง error เมื่อผู้ใช้พิมพ์
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // ตรวจสอบว่าทุกช่องมีค่า
    const requiredFields = [
      'username', 'password', 'email', 'fullName', 'birthDate',
      'phone', 'address', 'chronicDisease', 'drugAllergy', 'foodAllergy'
    ];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    if (emptyFields.length > 0) {
      setErrorMessage(`Please fill in all fields: ${emptyFields.join(', ')}`);
      return;
    }

    console.log("Submitting form data:", formData); // ตรวจสอบ formData

    try {
      const response = await fetch('http://localhost:5001/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setErrorMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('Network error or server unavailable');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="border p-2 w-full"
          required
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 w-full"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 w-full"
          required
        />
        <input
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 w-full"
          required
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 w-full"
          required
        />
        <input
          name="chronicDisease"
          value={formData.chronicDisease}
          onChange={handleChange}
          placeholder="Chronic Disease"
          className="border p-2 w-full"
          required
        />
        <input
          name="drugAllergy"
          value={formData.drugAllergy}
          onChange={handleChange}
          placeholder="Drug Allergy"
          className="border p-2 w-full"
          required
        />
        <input
          name="foodAllergy"
          value={formData.foodAllergy}
          onChange={handleChange}
          placeholder="Food Allergy"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Register;