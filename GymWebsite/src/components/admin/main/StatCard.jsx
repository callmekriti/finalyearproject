import React from "react";

const StatCard = ({ icon, title, value }) => (
  <div className="flex flex-col justify-between w-full h-48 bg-white dark:bg-slate-50 p-4 rounded-md shadow-xl ">
    <div className="flex items-center justify-between">
      <div className="text-4xl text-indigo-950 dark:text-orange-500">
        {icon}
      </div>
    </div>
    <div className="font-extrabold font-Roboto text-2xl text-indigo-950 dark:text-black">
      {title}
    </div>
    <div className="text-2xl font-semibold text-indigo-950 dark:text-black">
      {value}
    </div>
  </div>
);

export default StatCard;
