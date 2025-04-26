import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MdDelete, MdAddCircleOutline } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import GlobalContext from "../../context/GlobalContext";
import FormModal from './FormModal';
import AddTrainerForm from './AddTrainerForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Trainer({ searchQuery }) {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchTrainersCount } = useContext(GlobalContext);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/trainers/');
      setTrainers(response.data || []);
      setFilteredTrainers(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load trainers');
      setTrainers([]);
      setFilteredTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (trainer = null) => {
    setCurrentTrainer(trainer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTrainer(null);
  };

  const deleteTrainer = async (id) => {
    if (!id) {
      toast.error('No trainer selected for deletion');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/trainers/${id}/`);
      if (response.status === 200) {
        const updatedTrainers = trainers.filter((trainer) => trainer.id !== id);
        setTrainers(updatedTrainers);
        setFilteredTrainers(updatedTrainers);
        fetchTrainersCount();
        toast.success('Trainer deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
      toast.error('Failed to delete trainer');
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = trainers.filter(trainer => 
        (trainer.name && trainer.name.toLowerCase().includes(lowerCaseQuery)) ||
        (trainer.email && trainer.email.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredTrainers(filtered);
    } else {
      setFilteredTrainers(trainers);
    }
  }, [searchQuery, trainers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredTrainers.length} {filteredTrainers.length === 1 ? 'trainer' : 'trainers'} found
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiUserPlus className="mr-2 h-5 w-5" />
          Add Trainer
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No trainers found
                  </td>
                </tr>
              ) : (
                filteredTrainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trainer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{trainer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trainer.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${trainer.salary?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {trainer.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(trainer)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FaPenToSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this trainer?')) {
                            deleteTrainer(trainer.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={modalOpen} onClose={closeModal}>
        <AddTrainerForm
          trainer={currentTrainer}
          onClose={closeModal}
          refreshTrainers={fetchTrainers}
        />
      </FormModal>
    </div>
  );
}

export default Trainer;