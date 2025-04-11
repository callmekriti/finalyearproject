import React, { useState, useContext } from 'react';
import { CalendarIcon } from 'lucide-react';
import SmallCalendar from '../calendar/SmallCalendar'// Adjust the import path as needed

function DateInputWithCalendar({ selectedDate, onDateChange }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (day) => {
    onDateChange(day);
    setShowCalendar(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          value={selectedDate.format('DD-MM-YYYY')}
          readOnly
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onClick={() => setShowCalendar(!showCalendar)}
        />
        <button onClick={() => setShowCalendar(!showCalendar)} className="ml-2">
          <CalendarIcon size={24} />
        </button>
      </div>
      {showCalendar && (
        <div className="absolute top-12 left-0 z-10 bg-white border rounded-lg shadow-lg p-4">
          <SmallCalendar onDateSelect={handleDateSelect} />
        </div>
      )}
    </div>
  );
}

export default DateInputWithCalendar;
