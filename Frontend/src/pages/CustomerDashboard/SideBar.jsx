import { FaArrowAltCircleLeft, FaEdit } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ customer, openImage, refreshCustomer }) => {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="relative w-72 bg-gradient-to-r from-indigo-600 to-violet-700 
        shadow-lg rounded-xl p-4 flex flex-col items-center gap-4 overflow-y-auto 
        sticky top-0 h-screen">

      {/* Avatar */}
      <div className="mt-8 w-28 h-28 rounded-full border-2 border-white bg-gray-300 
        flex items-center justify-center text-gray-500 text-4xl font-bold shadow">
        {customer.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      {/* Name + Edit Button */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-white text-center">
          {customer.name}
        </h2>

        <button
          onClick={() => setShowEdit(true)}
          className="text-white hover:text-yellow-300 transition"
        >
          <FaEdit size={18} />
        </button>
      </div>

      {/* Customer Details */}
      <div className="text-sm text-white space-y-1 w-full mt-2">
        {[
          ["Phone", customer.phone_number],
          ["NIC", customer.nic],
          ["Email", customer.email],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="font-semibold w-28">{label}:</span>
            <span>{value || "-"}</span>
          </div>
        ))}
      </div>

      {/* NIC Images */}
      {/*<div className="flex gap-4 mt-6 justify-center w-full">
        <img
          src={customer.nic_photo_front || "/nic-front-placeholder.png"}
          alt="NIC Front"
          onClick={() => openImage(customer.nic_photo_front)}
          className="w-32 h-20 rounded-lg object-cover border-2 border-white p-1 shadow cursor-pointer hover:scale-105 transition"
        />
        <img
          src={customer.nic_photo_back || "/nic-back-placeholder.png"}
          alt="NIC Back"
          onClick={() => openImage(customer.nic_photo_back)}
          className="w-32 h-20 rounded-lg object-cover border-2 border-white p-1 shadow cursor-pointer hover:scale-105 transition"
        />
      </div>*/}
    </div>
  );
};

export default Sidebar;
