import React, { useState, useEffect } from "react";
import axios from "axios";

function Transaction() {
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    
    if (searchValue === "") {
      setFilteredTypes(membershipTypes);
    } else {
      setFilteredTypes(
        membershipTypes.filter((type) =>
          type.type_name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/membershipTypes/");
        const data = response?.data?.data || [];
        console.log("Data fetched:", data);
        
        // Add transaction IDs for display purposes
        const processedData = data.map(type => ({
          ...type,
          transactionId: generateRandomId()
        }));
        
        setMembershipTypes(processedData);
        setFilteredTypes(processedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load membership types data");
        setMembershipTypes([]);
        setFilteredTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipTypes();
  }, []);

  function generateRandomId() {
    return Math.random().toFixed(5).toString().split(".")[1];
  }

  if (loading) return <div className="m-6">Loading membership types...</div>;
  if (error) return <div className="m-6 text-red-500">{error}</div>;
  if (filteredTypes.length === 0) return <div className="m-6">No membership types found</div>;

  return (
    <div>
      <h2 className="mx-6 font-bold text-4xl">Transaction</h2>
      <div className="mx-6">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          placeholder="Search by package name"
          className="w-[40%] p-2 mb-4 border rounded-lg border-gray-400 bg-slate-100"
        />
      </div>

      <div className="m-6">
        {filteredTypes.map((type) => (
          <div
            key={type.membership_type_id}
            className="bg-white shadow-md rounded-lg p-6 mb-4 grid md:grid-cols-3 gap-4 lg:grid-cols-6"
          >
            <div>
              <div className="font-bold text-lg">Transaction Id</div>
              <div className="font-medium">{type.transactionId}</div>
            </div>
            
            <div>
              <div className="font-bold text-lg">Package ID</div>
              <div className="font-medium">{type.membership_type_id}</div>
            </div>
            
            <div>
              <div className="font-bold text-lg">Package</div>
              <div className="font-medium">{type.type_name}</div>
            </div>
            
            <div>
              <div className="font-bold text-lg">Duration (months)</div>
              <div className="font-medium">{type.duration}</div>
            </div>
            
            <div>
              <div className="font-bold text-lg">Total Price</div>
              <div className="font-medium">{type.price}</div>
            </div>
            
            <div>
              <div className="font-bold text-lg">Status</div>
              <div className="font-medium text-green-600">Available</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transaction;