import React from "react";
import CalendarHeader from "../admin/calendar/CalendarHeader";
import Month from "../admin/calendar/Month";
import { getMonth } from "../admin/calendar/util";
import { Link } from "react-router-dom";

const GymEvent = () => {
  return (
    <div className="h-screen flex flex-col">
      <button className=" border-2 w-[100px] m-2 rounded-lg bg-blue-600 ">
        <Link to="/dashboard" className="text-black">
          Go back
        </Link>
      </button>

      <CalendarHeader />
      <div className="flex flex-1">
        <Month month={getMonth()} />
      </div>
    </div>
  );
};

export default GymEvent;
