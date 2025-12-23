import {
  FaArrowAltCircleLeft,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditCustomerForm from "../EditCustomerForm";

const CustomerSidebar = ({ customer, openImage, refreshCustomer }) => {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`relative bg-gradient-to-r from-indigo-600 to-violet-700
      shadow-lg rounded-xl p-4 flex flex-col items-center gap-4 overflow-y-auto
      sticky top-0 h-screen transition-all duration-300
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* ---------------- COLLAPSE BUTTON ---------------- */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-3 p-2 bg-white/20 text-white rounded-full hover:bg-white/30"
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* ---------------- MODAL OVERLAY ---------------- */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[50%] max-w-lg relative">
            <EditCustomerForm
              customer={customer}
              onCancel={() => setShowEdit(false)}
              onSuccess={() => {
                setShowEdit(false);
                refreshCustomer();
              }}
            />
          </div>
        </div>
      )}

      {/* ---------------- BACK BUTTON ---------------- */}
      {!collapsed && (
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-3 p-3 bg-white/20 text-white rounded-full hover:bg-white/30"
      >
        <FaArrowAltCircleLeft size={20} />
      </button>
    )}

      {/* Avatar */}
      <div className="mt-10 w-16 h-16 rounded-full border-2 border-white bg-gray-300 
        flex items-center justify-center text-gray-500 text-2xl font-bold shadow">
        {customer.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      {/* Name + Edit */}
      {!collapsed && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">
            {customer.name}
          </h2>
          <button
            onClick={() => setShowEdit(true)}
            className="text-white hover:text-yellow-300"
          >
            <FaEdit size={16} />
          </button>
        </div>
      )}

      {/* Customer Details */}
      {!collapsed && (
        <div className="text-sm text-white space-y-1 w-full mt-2">
          {[
            ["Phone", customer.phone_number],
            ["NIC", customer.nic],
            ["Email", customer.email],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="font-semibold">{label}:</span>
              <span>{value || "-"}</span>
            </div>
          ))}
        </div>
      )}

      {/* NIC Images */}
      {!collapsed && (
        <div className="flex gap-3 mt-6 justify-center w-full">
          <img
            src={customer.nic_photo_front || "/nic-front-placeholder.png"}
            alt="NIC Front"
            onClick={() => openImage(customer.nic_photo_front)}
            className="w-28 h-18 rounded-lg object-cover border-2 border-white p-1 shadow cursor-pointer"
          />
          <img
            src={customer.nic_photo_back || "/nic-back-placeholder.png"}
            alt="NIC Back"
            onClick={() => openImage(customer.nic_photo_back)}
            className="w-28 h-18 rounded-lg object-cover border-2 border-white p-1 shadow cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default CustomerSidebar;
