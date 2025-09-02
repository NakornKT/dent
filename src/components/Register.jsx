import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    birthDate: '',
    address: '',
    chronicDisease: '',
    drugAllergy: '',
    foodAllergy: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setErrorMessage(data.error || 'Registration failed');
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
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone (10 digits)"
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
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;