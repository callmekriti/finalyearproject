import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTrainerForm = ({ trainer, onClose, refreshTrainers }) => {
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    type: '',
    email: '',
    password: '',
    username: '', // Added username field
  });

  useEffect(() => {
    if (trainer) {
      setFormData({
        name: trainer.name,
        salary: trainer.salary,
        type: trainer.type,
        email: trainer.email || '',
        username: trainer.username || '', //Include username in update
      });
    }
  }, [trainer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (trainer) {
        await axios.put(`http://localhost:8000/trainers/${trainer.id}/`, formData); // Includes username in edit now
      } else {
        console.log(formData);
        await axios.post('http://localhost:8000/trainers/', formData);
      }
      onClose();
      refreshTrainers();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Optionally, display error.response.data to user.
      if (error.response && error.response.data) {
        console.log("Server Response:", error.response.data);
        // Display a user-friendly error message based on error.response.data
        alert(JSON.stringify(error.response.data)); // simple alert.  Replace with better UI.
      }

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Salary
        </label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type
        </label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
       <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      {!trainer && ( //Conditionally render this on create, but not edit
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {trainer ? 'Update Trainer' : 'Add Trainer'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTrainerForm;