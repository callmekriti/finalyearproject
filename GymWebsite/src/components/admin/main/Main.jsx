import React, { useContext,useState,useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import SmallCalendar from "../calendar/SmallCalendar";
import DueTable from "./DueTable";
import StatCard from "./StatCard";
import BarGraph from "../report/BarGraph";
import axios from "axios";
function Main() {
  const { getTotalMembers, totalSalary, totalMembershipPrice } = useContext(GlobalContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analytics/');
        console.log(response.data);
        setAnalyticsData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching analytics:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-slate-100 dark:bg-slate-100">
      <section className="mt-3 mb-3 w-full md:w-[70%] h-full">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 m-4">
          <StatCard
            icon={<FaMoneyBillTransfer />}
            title="Total Sales"
            value={analyticsData?.total_income}
          />
          <StatCard
            icon={<IoIosPeople />}
            title="Total Members"
            value={analyticsData?.member_count}
          />
          <StatCard
            icon={<FaMoneyBillTransfer />}
            title="Total Expense"
            value={analyticsData?.total_expenses}
          />
        </div>
        <div className="pl-5">
          <DueTable />
        </div>
      </section>
      <section className="w-full  md:w-[30%] bg-indigo-100 dark:bg-slate-200 shadow-sm ">
        <div className="bg-slate-100 rounded-md m-2 p-2">
          <SmallCalendar />
        </div>
        <div className="bg-slate-100 m-2 shadow-sm rounded-xl  ">
          {analyticsData && <BarGraph data={analyticsData}/>}
        </div>
      </section>
    </div>
  );
}

export default Main;
