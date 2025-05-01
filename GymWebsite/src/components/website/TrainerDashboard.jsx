import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaMoneyBill, FaCog, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTrainer, setEditedTrainer] = useState(null); // State for the edited data
    const navigate = useNavigate();

    useEffect(() => {
        const trainerId = localStorage.getItem('userId');
        if (!trainerId) {
            console.error("No trainer ID found in localStorage.");
            setError("No trainer ID found. Please log in.");
            setLoading(false);
            navigate('/login');
            return;
        }

        const apiUrl = `http://localhost:8000/trainers/${trainerId}/`;

        axios.get(apiUrl)
            .then(response => {
                setTrainer(response.data);
                setEditedTrainer(response.data); // Initialize editedTrainer with initial data
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching trainer data:", error);
                setError("Failed to load trainer data. Please try again later.");
                setLoading(false);
            });
    }, [navigate]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTrainer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveClick = () => {
        const trainerId = localStorage.getItem('userId');
        const apiUrl = `http://localhost:8000/trainers/${trainerId}/`;

        axios.put(apiUrl, editedTrainer)
            .then(response => {
                setTrainer(response.data); // Update the trainer state with the updated data from the server
                setIsEditing(false);
            })
            .catch(error => {
                console.error("Error updating trainer data:", error);
                setError("Failed to update trainer data."); // Set an error state
            });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedTrainer(trainer); // Reset to the original trainer data. Very important!
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold">Loading trainer data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Trainer Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Section */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700 flex items-center">
                        <FaUser className="mr-2" /> Profile
                    </h2>
                    {isEditing ? (
                        <>
                            <div className="mb-2">
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editedTrainer.name || ''} // Use editedTrainer's name, handle undefined
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editedTrainer.email || ''} //Use editedTrainer's email, handle undefined
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600">
                                <FaUser className="inline-block mr-1" /> <strong>Name:</strong> {trainer.name}
                            </p>
                            <p className="text-gray-600">
                                <FaEnvelope className="inline-block mr-1" /> <strong>Email:</strong> {trainer.email}
                            </p>
                        </>
                    )}
                     {!isEditing && (
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                                type="button"
                                onClick={handleEditClick}
                            >
                                <FaEdit className="inline-block mr-1" />Edit Profile
                            </button>
                        )}
                </div>

                {/* Salary Section */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700 flex items-center">
                        <FaMoneyBill className="mr-2" /> Salary Information
                    </h2>
                    {isEditing ? (
                        <div className="mb-2">
                            <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">Salary:</label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={editedTrainer.salary || ''} //Use editedTrainer's salary, handle undefined
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-600">
                            <FaMoneyBill className="inline-block mr-1" /> <strong>Salary:</strong> ${trainer.salary}
                        </p>
                    )}
                </div>

                {/* Type Section */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700 flex items-center">
                        <FaCog className="mr-2" /> Trainer Type
                    </h2>
                    {isEditing ? (
                         <div className="mb-2">
                             <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                             <input
                                 type="text"
                                 id="type"
                                 name="type"
                                 value={editedTrainer.type || ''} // Use editedTrainer's type, handle undefined
                                 onChange={handleInputChange}
                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                             />
                         </div>
                     ) : (
                        <p className="text-gray-600">
                            <FaCog className="inline-block mr-1" /> <strong>Type:</strong> {trainer.type}
                        </p>
                     )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                    <div className="col-span-2 flex justify-end">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                            type="button"
                            onClick={handleSaveClick}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDashboard;