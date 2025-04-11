import React from 'react';
import fitgirl from "../../assets/fitgirl.jpeg";

import { Link as ScrollLink } from "react-scroll";
import { listStyle } from "./Config";
 
const HeroSection = () => {
  //herosection test complete
  return (
    <div className="bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:px-0 md:py-12 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col md:items-start md:pl-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Destroy the old you
              <br />
               before it destroys you.
            </h1>
            <p className="text-xl mb-4 mt-4">
          Join our community and start your journey to a healthier, stronger you.
        </p>
            <div className="mt-6 md:mt-8">
              <button className="bg-[#FF5C00] text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-md mr-4 hover:bg-[#FF3A00]">
              <ScrollLink to="programs-section" smooth={true} duration={500} className={listStyle}>
                  Explore Programs
                </ScrollLink>              </button>
              <button className="bg-gray-800 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-md hover:bg-gray-700">
              <ScrollLink to="pricing-section" smooth={true} duration={500} className={listStyle}>
                  Pricing
                </ScrollLink>
              </button>
            </div>
          </div>
 
          <div className="flex justify-center md:justify-end md:pr-8 ">
            <img src={fitgirl} alt="Hero" className="max-w-full h-auto rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default HeroSection;