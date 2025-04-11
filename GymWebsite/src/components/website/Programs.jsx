import React from 'react';
 
const programs = [
  {
    title: 'Strength Training',
    description: 'Our trainers will design progressive workout plans that proper active gains strength.',
    icon: '💪',
    color: 'bg-white',
  },
  {
    title: 'Basic Yoga',
    description: 'This program combines yoga with cardio & strength training to help lose weight & fitness.',
    icon: '🧘‍♀️',
    color: 'bg-white',
  },
  {
    title: 'Body Building',
    description: 'For those looking to increase muscle mass & enhance their strength & muscle.',
    icon: '🏋️‍♂️',
    color: 'bg-orange-600',
  },
  {
    title: 'Weight Loss',
    description: 'Our weight loss programs are designed to help you make sustainable lifestyle changes.',
    icon: '🏃‍♂️',
    color: 'bg-white',
  },
];
 
const ProgramCard = ({ title, description, icon, color }) => (
  <div className={`p-6 m-2 rounded-xl shadow-xl ${color} text-black`}>
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="mb-4">{description}</p>
   
  </div>
);
 
const Programs = () => (
  <div className="bg-gray-100  text-black py-12">
    <div className="container mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">The Best Programs We Offer For You</h2>
      <p className="mb-12 text-center">We offer a wide range of comprehensive fitness programs designed to cater to individuals of all fitness levels. Our aim is to help you achieve specific goals & maximize results.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {programs.map((program) => (
          <ProgramCard key={program.title} {...program} />
        ))}
      </div>
    </div>
  </div>
);
 
export default Programs;