import React from "react";
import Profile from "../../assets/Profile.jpg";
import img2 from "../../assets/img2.png";
import user2 from "../../assets/user2.jpg";



 
const testimonials = [
  {
    name: "David Salsa",
    location: "Park Street, Lvl-2, USA",
    avatar: Profile, 
    review:
      "The gym facilities are top-notch! I have been able to achieve my fitness goals thanks to the excellent equipment and helpful staff. Highly recommend to anyone looking to improve their fitness.",
    time: "2 days ago",
  },
  {
    name: "Lucia Martina",
    location: "Park Street, Lvl-2, USA",
    avatar: img2, 
    review:
      "Amazing gym experience! The trainers are very knowledgeable and supportive. The group classes are fun and challenging. I have seen great improvements in my overall health.",
    time: "A week ago",
  },
  {
    name: "John Doe",
    location: "Elm Street, Lvl-3, USA",
    avatar: user2, 
    review:
      "Great gym with a wide variety of equipment and classes. The environment is motivating and clean. The only downside is that it gets a bit crowded during peak hours.",
    time: "3 days ago",
  }
];
 
 
const TestimonialCard = ({ name, location, avatar, rating, review, time }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center mb-4">
      <img
        src={avatar}
        alt={`${name}'s avatar`}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <h4 className="text-lg font-semibold">{name}</h4>
        <p className="text-gray-500">{location}</p>
       
      </div>
    </div>
    <p className="mb-4">{`"${review}"`}</p>
    <p className="text-gray-400">{time}</p>
  </div>
);
 
const Testimonials = () => (
  <div className="min-h-screen bg-gray-100 py-12">
    <div className="container mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold">
          What Are The <span className="text-red-500">Consumers</span> Saying
          About Us
        </h2>
        <div className="flex justify-center items-center mt-4">
          <div className="flex -space-x-4 rtl:space-x-reverse">
            <img
              className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
              src={Profile}
              alt="Profile 1"
            />
            <img
              className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
              src={img2}
              alt="Profile 2"
            />
            <img
              className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
              src={user2}
              alt="Profile 3"
            />
            <span
              className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
             
            >
              +99
            </span>
          </div>
          <span className="ml-2 text-gray-500">+12k Review</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
     
    </div>
  </div>
);
 
export default Testimonials;