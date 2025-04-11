import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import GlobalContext from "../../context/GlobalContext";
import FormModal from './FormModal';
import AddTrainerForm from './AddTrainerForm'; 

function Trainer({ searchQuery }) {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState(null);
  const { fetchTrainersCount } = useContext(GlobalContext);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/trainers/');
      console.log('Data fetched:', response.data);
      setTrainers(response.data || []);
      setFilteredTrainers(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTrainers([]);
      setFilteredTrainers([]);
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
    console.log('Deleting trainer with id:', id);
    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/trainers/${id}/`);
      if (response.status === 200) {
        const updatedTrainers = trainers.filter((trainer) => trainer.id !== id);
        setTrainers(updatedTrainers);
        setFilteredTrainers(updatedTrainers);
        fetchTrainersCount();
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = trainers.filter(trainer => 
        trainer.name.toLowerCase().includes(lowerCaseQuery) ||
        trainer.email.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredTrainers(filtered);
    } else {
      setFilteredTrainers(trainers);
    }
  }, [searchQuery, trainers]);

  return (
    <div>
      <button onClick={() => openModal()} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Add Trainer
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTrainers.map((trainer) => (
              <tr key={trainer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {trainer.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{trainer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {trainer.salary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {trainer.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className='pl-0' onClick={() => openModal(trainer)}><FaPenToSquare /></button>
                  <button className="pl-4" onClick={() => deleteTrainer(trainer.id)}><MdDelete className='text-red-600 text-xl' /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
