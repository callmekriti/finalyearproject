import dayjs from "dayjs";
import React, { useEffect, useContext, useState } from "react";
import { getMonth } from "./util";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GlobalContext from "../../context/GlobalContext";

function SmallCalendar({ onDateSelect }) {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  const { setDaySelected, daySelected } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const handlePrevMonth = () => {
    setCurrentMonthIdx(currentMonthIdx - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthIdx(currentMonthIdx + 1);
  };

  const getDayClass = (day) => {
    const format = "DD-MM-YYYY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return "bg-blue-500 text-white";
    } else if (currDay === slcDay) {
      return "bg-blue-100 text-blue-600 font-semibold";
    } else {
      return "";
    }
  };

  const handleDateClick = (day) => {
    setDaySelected(day);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  return (
    <div className="mt-9 p-1 ">
      <header className="flex justify-between">
        <p className="text-gray-500 font-semibold">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </p>
        <div>
          <button type="button" onClick={handlePrevMonth}>
            <span>
              <ChevronLeft />
            </span>
          </button>
          <button type="button" onClick={handleNextMonth}>
            <span>
              <ChevronRight />
            </span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day, i) => (
          <span key={i} className="text-sm py-1 px-2 text-center">
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={() => handleDateClick(day)}
                className={`py-2 w-full ${getDayClass(day)}`}
              >
                <span className="text-sm">{day.format("D")}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default SmallCalendar;
