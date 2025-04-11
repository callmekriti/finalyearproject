import React, { useEffect, useReducer, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "./GlobalContext";

const saveEventsReducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTS":
      return action.payload;
    case "ADD_EVENT":
      return [...state, action.payload];
    case "UPDATE_EVENT":
      return state.map((evt) =>
        evt.id === action.payload.id ? action.payload : evt
      );
    case "DELETE_EVENT":
      return state.filter((evt) => evt.id !== action.payload.id);
    default:
      return state;
  }
};

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return Array.isArray(parsedEvents) ? parsedEvents : [];
}

function ContextWrapper({ children }) {
  const [daySelected, setDaySelected] = useState(dayjs());
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showEventModel, setShowEventModel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvents, dispatchCalEvent] = useReducer(
    saveEventsReducer,
    [],
    initEvents
  );
  const [membersType, setMembersType] = useState({
    basic: 0,
    premium: 0,
    standard: 0,
  });
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalMembershipPrice, setTotalMembershipPrice] = useState(0);




  const fetchMembersCount = async () => {
    try {
      const [basicRes, standardRes, premiumRes] = await Promise.all([

        fetch("http://localhost:8000/membershipTypes/"),
        fetch("http://localhost:8000/membershipTypes/"),
        fetch("http://localhost:8000/membershipTypes/"),
      ]);

      const [basic,standard ,premium ] = await Promise.all([
        basicRes.json(),
        premiumRes.json(),
        standardRes.json(),
      ]);

      setMembersType({
        basic: basic.data,
        premium: premium.data,
        standard: standard.data,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchTotalSalary = async () => {
    try {
      const response = await fetch("http://localhost:8000/members/");
      const data = await response.json();
      setTotalSalary(data);
    } catch (error) {
      console.error("Error fetching total salary:", error);
    }
  };

  const fetchTotalMembershipPrice = async () => {
    try {
      const response = await fetch("http://localhost:8000/members/");
      const data = await response.json();
      setTotalMembershipPrice(data.data);  // Assuming data.data contains the total price
    } catch (error) {
      console.error("Error fetching total membership price:", error);
    }
  };

  useEffect(() => {
    fetchMembersCount();
    fetchTotalSalary();
    fetchTotalMembershipPrice();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events/");
        const data = await response.json();
        dispatchCalEvent({ type: "SET_EVENTS", payload: data });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    if (!showEventModel) {
      setSelectedEvent(null);
    }
  }, [showEventModel]);

  const getTotalMembers = () => {
    return membersType.basic + membersType.premium + membersType.standard;
  };

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        daySelected,
        setDaySelected,
        showEventModel,
        setShowEventModel,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        membersType,
        fetchMembersCount,
        getTotalMembers,
        totalSalary, // Add totalSalary to the context
        totalMembershipPrice,

      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default ContextWrapper;
