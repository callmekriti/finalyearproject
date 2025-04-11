import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import Hamburger from "./Hamburger";
import UserDropdown from "./UserDropdown";
import { listStyle } from "./Config";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="shadow md:shadow-lg fixed h-[5rem] w-[100%] flex justify-between items-center bg-[#fff] mb-10">
      <div className="w-[92%] flex justify-between mx-auto p-3 relative">
        <div className="w-[100px] flex items-center">
          <h2 className="font-bold text-2xl">Fitness</h2>
          <h2 className="text-red-500 font-bold text-2xl">Hub</h2>
        </div>
        <div className="w-[40px] flex justify-center md:w-[70%] ">
          <Hamburger />
          <div className="hidden md:flex md:justify-center md:items-center md:w-[70%] xl:w-[65%]">
            <ul className="md:flex md:w-[100%] xl:w-[100%] md:justify-around">
              <li>
                <ScrollLink to="hero-section" smooth={true} duration={500} className={listStyle}>
                  Home
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="programs-section" smooth={true} duration={500} className={listStyle}>
                  Programs
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="pricing-section" smooth={true} duration={500} className={listStyle}>
                  Pricing
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="testimonials-section" smooth={true} duration={500} className={listStyle}>
                  Testimonials
                </ScrollLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {isLoggedIn ? (
            <UserDropdown />
          ) : (
            <Link to="/signin" className="relative">
              Login
              <span className="absolute inset-0 m-auto w-[50px] h-[50px] rounded-inherit scale-0 z-[-1] bg-[#2395bb] transition-all duration-600 ease-[cubic-bezier(0.23, 1, 0.32, 1)] group-hover:scale-[3]"></span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
