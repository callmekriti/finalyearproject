import React from 'react';

const Notifications = ({ title, description, label, day }) => {
  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto">
      <div className="rounded-lg shadow-xs overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m-1-4h.01M17 16h-1v-4h-1m-1-4h.01M6 8h.01M6 12h.01M6 16h.01"
                />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm leading-5 font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                <strong>Label:</strong> {label}
              </p>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                <strong>Day:</strong> {day}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
