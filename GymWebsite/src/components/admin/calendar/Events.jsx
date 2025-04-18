import React, { useEffect } from "react";
import { useState, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import CalendarHeader from "./CalendarHeader";
import Sidebar from "./SideBar";
import Month from "./Month";
import EventModel from "./EventModel";
import { getMonth } from "./util";

function Events() {
  const [curentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModel } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);
  return (
    <>
      {showEventModel && <EventModel />}

      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={curentMonth} />
        </div>
      </div>
    </>
  );
}

export default Events;
