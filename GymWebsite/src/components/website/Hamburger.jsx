import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import hamburger from "../../assets/hamburger.png";
import close from "../../assets/close.png";
import { listStyle } from "./Config";
import { Link } from "react-router-dom";

const Hamburger = () => {
  const [isMenu, setIsMenu] = useState(false);

  return (
    <>
      {isMenu ? (
        <div className="w-[36px]">
          <img
            className="w-[100%] md:hidden"
            src={close}
            alt="list menu"
            onClick={() => setIsMenu(false)}
          />
<div className="w-full h-[250px] bg-slate-100  absolute md:hidden left-0 top-[4.5rem]">
<ul className="w-[100%] h-[100%] flex flex-col justify-around items-center">
              <li>
                <ScrollLink to="hero-section" smooth={true} duration={500} className={listStyle} onClick={() => setIsMenu(false)}>
                  Home
                </ScrollLink>
              </li>
             
              <li>
                <ScrollLink to="programs-section" smooth={true} duration={500} className={listStyle} onClick={() => setIsMenu(false)}>
                  Programs
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="pricing-section" smooth={true} duration={500} className={listStyle} onClick={() => setIsMenu(false)}>
                  Pricing
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="testimonials-section" smooth={true} duration={500} className={listStyle} onClick={() => setIsMenu(false)}>
                  Testimonials
                </ScrollLink>
              </li>
              <button className="px-[25px] text-[18px] font-medium font-display rounded-md tracking-wider">
              <Link to="/signin" className="relative">
              Login
              <span className="absolute inset-0 m-auto w-[50px] h-[50px] rounded-inherit scale-0 z-[-1] bg-[#2395bb] transition-all duration-600 ease-[cubic-bezier(0.23, 1, 0.32, 1)] group-hover:scale-[3]"></span>
            </Link>              </button>
             
            </ul>
          </div>
        </div>
      ) : (
        <img
          className="w-[100%] md:hidden"
          src={hamburger}
          alt="hamburger menu"
          onClick={() => setIsMenu(true)}
        />
      )}
    </>
  );
};

export default Hamburger;
