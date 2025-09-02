import React, { useState } from 'react';
import axios from 'axios';

function TreatmentHistory({ treatments, onAddTreatment }) {
  const [formData, setFormData] = useState({
    appointment_id: '',
    treatment_date: '',
    treatment_detail: '',
    treatment_result: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTreatment(formData);
    setFormData({ appointment_id: '', treatment_date: '', treatment_detail: '', treatment_result: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold">Treatment History</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="number"
          placeholder="Appointment ID"
          value={formData.appointment_id}
          onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="date"
          value={formData.treatment_date}
          onChange={(e) => setFormData({ ...formData, treatment_date: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <textarea
          placeholder="Treatment Details"
          value={formData.treatment_detail}
          onChange={(e) => setFormData({ ...formData, treatment_detail: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <textarea
          placeholder="Treatment Result/Next Steps"
          value={formData.treatment_result}
          onChange={(e) => setFormData({ ...formData, treatment_result: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Treatment</button>
      </form>
      <ul className="mt-4 space-y-2">
        {treatments.map(treatment => (
          <li key={treatment.treatment_id} className="p-2 bg-blue-100 rounded">
            {treatment.treatment_date}: {treatment.treatment_detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TreatmentHistory;