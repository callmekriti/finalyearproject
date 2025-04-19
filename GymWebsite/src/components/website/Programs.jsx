import React from 'react';
// Make sure to install react-icons: npm install react-icons
import { FaArrowRight } from 'react-icons/fa';

// --- Programs Data ---
const programs = [
    {
      title: 'Strength Training',
      description: 'Progressive workout plans designed for proper form and effective strength gains.',
      icon: '💪',
      theme: 'indigo',
    },
    {
      title: 'Basic Yoga',
      description: 'Combines yoga flows with cardio & strength elements for holistic fitness and weight management.',
      icon: '🧘‍♀️',
      theme: 'teal',
    },
    {
      title: 'Body Building',
      description: 'Targeted programs for increasing muscle mass, enhancing definition, and boosting strength.',
      icon: '🏋️‍♂️',
      theme: 'amber',
    },
    {
      title: 'Weight Loss',
      description: 'Sustainable lifestyle changes through personalized nutrition guidance and effective workouts.',
      icon: '🏃‍♂️',
      theme: 'rose',
    },
];


// --- Program Card Component ---
// Added a check to hide the button specifically for "Strength Training"
const ProgramCard = ({ title, description, icon, theme = 'gray' }) => {
  // Define color classes based on the theme prop
  // Ensure these colors are enabled in your tailwind.config.js
  const themeClasses = {
    bg: `bg-${theme}-100`,
    text: `text-${theme}-600`,
    buttonBg: `bg-${theme}-500`,
    buttonHoverBg: `hover:bg-${theme}-600`,
  };

  // Determine if the button should be shown
  const showButton = title !== 'Strength Training';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transform transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5">
      <div className={`p-6 ${showButton ? 'pb-4' : 'pb-6'} flex-grow`}> {/* Adjust padding based on button presence */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${themeClasses.bg} ${themeClasses.text} mb-5 mx-auto shadow-md`}>
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">{title}</h3>
        <p className="text-sm text-gray-600 text-center leading-relaxed">{description}</p>
      </div>

      {/* Conditionally render the button section */}
      {showButton && (
        <div className="px-6 pb-6 pt-2 mt-auto">
          <a
            href="#program-details" // Use a more relevant placeholder or actual link
            className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium text-sm text-white ${themeClasses.buttonBg} ${themeClasses.buttonHoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme}-500 transition-colors duration-200 group`}
          >
            Learn More
            <FaArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      )}
    </div>
  );
};


// --- Main Programs Component ---
const Programs = () => (
  // Slightly lighter background, more padding
  <div className="bg-gray-50 text-gray-800 py-16 sm:py-24">
    <div className="container mx-auto px-4">
      {/* Centered text, constrained width for better readability */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
         <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
           The Best <span className="text-indigo-600">Programs</span> We Offer For You {/* Added accent color */}
         </h2>
         <p className="text-base md:text-lg text-gray-600 leading-relaxed">
           Explore our comprehensive fitness programs designed for all levels. Achieve your specific goals with expert guidance and maximize your results.
         </p>
      </div>

      {/* Slightly larger gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {programs.map((program) => (
          <ProgramCard key={program.title} {...program} />
        ))}
      </div>
    </div>
  </div>
);

export default Programs;