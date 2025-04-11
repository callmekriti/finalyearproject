import React, {useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import Dumbbell from "./Dumbbell.png";
import Logo from "./Logo.png";
import { RiDashboardFill } from "react-icons/ri";
import { MdPeopleAlt, MdAnalytics } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { GiStrong } from "react-icons/gi";
import { FaCalendarDays } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";

function Sidebar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Changed from "roles" to match your App.js
    setIsLoggedIn(false);
    navigate("/");
    console.log("User logged out");
  };

  return (
    <div className="h-screen bg-slate-200 dark:bg-white">
      <div className="flex flex-col gap-3 w-full text-slate-300 h-full justify-between">
        <div className="flex flex-col gap-10 px-4 mt-4">
          <div className="flex items-center justify-center gap-3">
            <div className="block md:hidden">
              <img src={Dumbbell} alt="Dumbbell" />
            </div>
            <div className="hidden md:block w-32 h-auto md:w-48">
              <img src={Logo} alt="Logo" className="" />
            </div>
          </div>
          <div className="flex flex-col gap-5 text-md sm:text-sm lg:text-lg ">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <RiDashboardFill className="text-2xl text-orange-500"/>
              <span className="hidden sm:flex text-slate-600 hover:text-slate-400 cursor-pointer font-Roboto">
                Dashboard
              </span>
            </Link>
            <Link to="/admin/members" className="flex items-center gap-3">
              <MdPeopleAlt className="text-2xl text-orange-500" />
              <span className="hidden font-Roboto sm:flex text-slate-600 hover:text-slate-400 cursor-pointer">
                Members
              </span>
            </Link>
            <Link to="/admin/transactions" className="flex items-center gap-3">
              <GrTransaction className="text-2xl text-orange-500"/>
              <span className="hidden sm:flex text-slate-600 hover:text-slate-400 cursor-pointer">
                Transactions
              </span>
            </Link>
            <Link to="/admin/trainers" className="flex items-center gap-3">
              <GiStrong className="text-2xl text-orange-500"/>
              <span className="hidden font-Roboto sm:flex text-slate-600 hover:text-slate-400 cursor-pointer">
                Trainers
              </span>
            </Link>
            <Link to="/admin/events" className="flex items-center gap-3">
              <FaCalendarDays className="text-2xl text-orange-500"/>
              <span className="hidden font-Roboto sm:flex text-slate-600 hover:text-slate-400 cursor-pointer">
                Events
              </span>
            </Link>
            <Link to="/admin/analytics" className="flex items-center gap-3">
              <MdAnalytics className="text-2xl text-orange-500"/>
              <span className="hidden font-Roboto sm:flex text-slate-600 hover:text-slate-400 cursor-pointer">
                Analytics
              </span>
            </Link>
          </div>
        </div>
       
        <div className="flex items-center text-md text-slate-600 hover:text-slate-400 sm:text-xs md:text-sm lg:text-lg px-4 mb-4 gap-3">
          <IoLogOut className="text-md text-orange-500"/>
          <span 
          onClick={handleLogout}
          className="hidden font-Roboto sm:flex cursor-pointer">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;