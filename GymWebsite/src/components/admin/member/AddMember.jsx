import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import DateInputWithCalendar from "./DateInputWithCalendar";
import Dropdown from "./Dropdown";
import BMICalculator from "./BMICalculator";
import dayjs from "dayjs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dropIn = {
  hidden: {
    y: "-50vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "50vh",
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const AddMember = ({ modalOpen, handleClose, member }) => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: dayjs(),
    membership_start_date: dayjs(),
    membership_end_date: dayjs(),
    membership_type: "",
    weight: "",
    height: "",
  });
  const [loading, setLoading] = useState(false);

  const membershipTypes = [
    { membership_type_id: 1, type_name: "Basic" },
    { membership_type_id: 2, type_name: "Standard" },
    { membership_type_id: 3, type_name: "Premium" },
  ];
console.log(member);
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone_number: member.phone_number,
        address: member.address,
        date_of_birth: dayjs(member.date_of_birth),
        membership_start_date: dayjs(member.membership_start_date),
        membership_end_date: dayjs(member.membership_end_date),
        membership_type: member.membership_type,
        weight: member.weight || "",
        height: member.height || "",
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectMembershipType = (typeId) => {
    setFormData((prev) => ({
      ...prev,
      membership_type: typeId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.address ||
      !formData.membership_type
    ) {
      toast.error("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      date_of_birth: formData.date_of_birth.format("YYYY-MM-DD"),
      membership_start_date: formData.membership_start_date.format("YYYY-MM-DD"),
      membership_end_date: formData.membership_end_date.format("YYYY-MM-DD"),
      membership_type: formData.membership_type,
      weight: formData.weight,
      height: formData.height,
    };

    try {
      let response;
      if (member) {
        console.log
        response = await axios.put(
          `http://localhost:8000/members/${member.member_id}/`,
          data
        );
        toast.success("Member updated successfully");
      } else {
        console.log(data);
        response = await axios.post("http://localhost:8000/members/", data);
        toast.success("Member added successfully!");
      }
      console.log("Response:", response.data);
      handleClose();
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        toast.error(
          `Error: ${error.response.data.message || "Failed to submit the form. Please try again."}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your network connection.");
      } else {
        console.error("Error:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="p-5 bg-slate-100 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] h-auto flex flex-col rounded-lg shadow-lg"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif font-bold text-lg">
                {member ? "Edit Member" : "Add Member"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-2xl text-red-500"
              >
                x
              </button>
            </div>
            <p className="font-serif text-gray-600">
              {member ? "Edit the details of the member" : "Add all the details of the member"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Contact</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                required
                onChange={handleChange}
                placeholder="Contact"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                placeholder="Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kilograms"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in centimeters"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                required
                onChange={handleChange}
                placeholder="Address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex flex-col flex-1">
                <label className="font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={formData.date_of_birth ? formData.date_of_birth.toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date_of_birth: new Date(e.target.value),
                    }))
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="font-medium">Membership Type</label>
                <Dropdown
                  options={membershipTypes.map((type) => ({
                    value: type.membership_type_id,
                    label: type.type_name,
                  }))}
                  onSelect={handleSelectMembershipType}
                  selectedOption={formData.membership_type}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex flex-col flex-1">
                <label className="font-medium">Start Date</label>
                <DateInputWithCalendar
                  selectedDate={formData.membership_start_date}
                  onDateChange={(date) =>
                    setFormData((prev) => ({ ...prev, membership_start_date: date }))
                  }
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="font-medium">End Date</label>
                <DateInputWithCalendar
                  selectedDate={formData.membership_end_date}
                  onDateChange={(date) =>
                    setFormData((prev) => ({ ...prev, membership_end_date: date }))
                  }
                />
              </div>
            </div>
          </div>

          {formData.weight && formData.height && (
            <div className="mt-4">
              <BMICalculator
                weight={parseFloat(formData.weight)}
                height={parseFloat(formData.height)}
              />
            </div>
          )}

          <div className="flex flex-col col-span-2 mt-4">
            <label className="font-medium">Payment Method</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${formData.paymentMethod === "Khalti" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "Khalti" }))}
              >
                Khalti
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${formData.paymentMethod === "Cash" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "Cash" }))}
              >
                Cash
              </button>
            </div>

            {formData.paymentMethod === "Khalti" && (
              <div className="mt-2">
                <label className="font-medium">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId || ""}
                  onChange={handleChange}
                  placeholder="Enter Khalti transaction ID"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mt-1 w-full"
                />
              </div>
            )}

            {formData.paymentMethod === "Cash" && (
              <div className="mt-2">
                <label className="font-medium">Amount</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount || ""}
                  onChange={handleChange}
                  placeholder="Enter cash amount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mt-1 w-full"
                />
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : member ? "Update" : "Add"}
          </motion.button>
          <ToastContainer />
        </form>
      </motion.div>
    </Backdrop>
  );
};

export default AddMember;
