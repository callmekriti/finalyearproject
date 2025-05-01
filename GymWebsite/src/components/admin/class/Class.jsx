import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Install: npm install react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [updateClassName, setUpdateClassName] = useState('');
  const [error, setError] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [timing, setTiming] = useState(null); // Class timing - now a Date object!

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, []);

  const API_ENDPOINT = 'http://localhost:8000/classes/';
  const TRAINER_API_ENDPOINT = 'http://localhost:8000/trainers/';

  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
      console.log(response);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Error fetching classes from server.');
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(TRAINER_API_ENDPOINT);
      setTrainers(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      setError('Error fetching trainers from server.');
    }
  };


  const handleCreateClass = async () => {
    if (!selectedTrainerId) {
      setError('Please select a trainer.');
      return;
    }

    if (!timing) {
      setError('Please select class timing.');
      return;
    }


    try {
        // Format the date to ISO 8601 string for DateTimeField compatibility
        const formattedTiming = timing.toISOString();

      const response = await axios.post(API_ENDPOINT, {
        name: newClassName,
        trainer_id: parseInt(selectedTrainerId, 10),
        timing: formattedTiming
      });
      setClasses([...classes, response.data]);
      setNewClassName('');
      setSelectedTrainerId('');
      setTiming(null); // Clear the Date object
      setCapacity('');
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleUpdateClass = async () => {
    if (!selectedClass) {
      setError('No class selected for update.');
      return;
    }

    try {
      // Format the date for the update as well
      const formattedTiming = selectedClass.timing ? new Date(selectedClass.timing).toISOString() : null;

      const response = await axios.put(`${API_ENDPOINT}${selectedClass.id}/`, {
        name: updateClassName,
         // Keep other fields intact during update (you might need to fetch the class data first)
        trainer: selectedClass.trainer,
        timing: formattedTiming, // Send the formatted date/time
      });

      setClasses(classes.map(c => (c.id === selectedClass.id ? response.data : c)));
      setSelectedClass(null);
      setUpdateClassName('');
    } catch (error) {
      console.error('Error updating class:', error);
      setError('Error updating class. Please check the data and try again.');
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) {
      setError('No class selected for deletion.');
      return;
    }
    try {
      await axios.delete(`${API_ENDPOINT}${selectedClass.id}/`);
      setClasses(classes.filter(c => c.id !== selectedClass.id));
      setSelectedClass(null);
    } catch (error) {
      console.error('Error deleting class:', error);
      setError('Error deleting class.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Class List</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Create Class */}
      <div className="mb-4">
        <label htmlFor="newClassName" className="block text-gray-700 text-sm font-bold mb-2">
          New Class Name:
        </label>
        <input
          type="text"
          id="newClassName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />

        <label htmlFor="trainer" className="block text-gray-700 text-sm font-bold mb-2 mt-2">
          Trainer:
        </label>
        <select
          id="trainer"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedTrainerId}
          onChange={(e) => setSelectedTrainerId(e.target.value)}
        >
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name}
            </option>
          ))}
        </select>

        <label htmlFor="timing" className="block text-gray-700 text-sm font-bold mb-2 mt-2">
          Timing:
        </label>
        <DatePicker
          selected={timing}
          onChange={(date) => setTiming(date)} // `date` will be a Date object
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholderText="Select date and time"
        />


        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleCreateClass}
        >
          Create Class
        </button>
      </div>

      {/* Class List */}
      <ul className="list-disc pl-5">
  {classes.map((c) => (
    <li key={c.id} className="mb-2">
      {c.name} - Trainer: {
        trainers.find(t => t.id === c.trainer_id)?.name || 'Unknown'
      } - Timing: {c.timing ? new Date(c.timing).toLocaleString() : 'N/A'} - Capacity: {c.capacity}
      <button
        className={`ml-2 px-2 py-1 rounded text-sm ${
          selectedClass?.id === c.id
            ? 'bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-700 text-white'
        }`}
        onClick={() => setSelectedClass(c.id === selectedClass?.id ? null : c)}
      >
        {selectedClass?.id === c.id ? 'Deselect' : 'Select'}
      </button>
    </li>
  ))}
</ul>

      {/* Update Class Form */}
      {selectedClass && (
        <div className="mb-4">
          <label htmlFor="updateClassName" className="block text-gray-700 text-sm font-bold mb-2">
            Update Class Name:
          </label>
          <input
            type="text"
            id="updateClassName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={updateClassName}
            onChange={(e) => setUpdateClassName(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
            onClick={handleUpdateClass}
          >
            Update Class
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={handleDeleteClass}
          >
            Delete Class
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassList;