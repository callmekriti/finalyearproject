import React, { useContext ,useState, useEffect} from "react";
import GlobalContext from "../../context/GlobalContext";
import axios from "axios";
function MemberTypeCard() {
  const { membersType } = useContext(GlobalContext);
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

  if (!membersType || typeof membersType !== "object") {
    return <div className="text-black">No membership data available</div>;
  }

  return (
    <div className="ms-10 me-10 font-Roboto grid sm:grid-cols md:grid-cols-3 lg:grid-cols-3 gap-20 m-4">
        <div
          key="premium"
          className="flex flex-col font-Roboto justify-around w-full md:w-auto h-40 bg-white shadow-lg p-4 rounded-md"
        >
          <div className="font-extrabold text-4xl sm:text-2xl lg:text-xl text-black">
            Premium Members
          </div>
          <div className="text-black text-2xl sm:text-xl lg:text-3xl font-semibold">
            {analyticsData?.total_premium} {/* Get the count of members */}
          </div>
        </div>
        <div
          key="standard"
          className="flex flex-col font-Roboto justify-around w-full md:w-auto h-40 bg-white shadow-lg p-4 rounded-md"
        >
          <div className="font-extrabold text-4xl sm:text-2xl lg:text-xl text-black">
            Standard Members
          </div>
          <div className="text-black text-2xl sm:text-xl lg:text-3xl font-semibold">
            {analyticsData?.total_standard} {/* Get the count of members */}
          </div>
        </div>
        <div
          key="basic"
          className="flex flex-col font-Roboto justify-around w-full md:w-auto h-40 bg-white shadow-lg p-4 rounded-md"
        >
          <div className="font-extrabold text-4xl sm:text-2xl lg:text-xl text-black">
            Basic Members
          </div>
          <div className="text-black text-2xl sm:text-xl lg:text-3xl font-semibold">
            {analyticsData?.total_basic} {/* Get the count of members */}
          </div>
        </div>
    </div>
  );
}


export default MemberTypeCard;