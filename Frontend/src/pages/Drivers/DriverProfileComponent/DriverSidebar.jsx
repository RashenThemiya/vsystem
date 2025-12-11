import { FaArrowAltCircleLeft, FaEdit } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditDriverForm from "../EditDriverForm"; // <-- import form

const DriverSidebar = ({ driver, openImage, refreshDriver }) => {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false); // modal control

  const documents = [
    { label: "Driver", src: driver.image },
    { label: "License", src: driver.license_image },
  ];

  return (
    <div className="relative w-72 bg-gradient-to-r from-indigo-600 to-violet-700 shadow-lg rounded-xl p-4 flex flex-col items-center gap-4 overflow-y-auto sticky top-0 h-screen">

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[40%] max-w-lg relative max-h-[100vh] -mt-4">

            <EditDriverForm
              driver={driver}
              onCancel={() => setShowEdit(false)}
              onUpdated={() => {
                setShowEdit(false);
                refreshDriver(); // refresh driver data after save
              }}
            />
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-3 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-full shadow hover:bg-gray-600"
      >
        <FaArrowAltCircleLeft size={20} />
      </button>

      {/* Driver Image */}
      <img
        src={driver.image || "/default-driver.png"}
        alt={driver.name}
        className="w-32 h-32 rounded-full border-2 border-gray-100 object-cover shadow-md mt-8"
      />

      {/* Name + Edit Button */}
      <div className="flex items-center gap-2 mt-2">
        <h2 className="text-xl font-bold text-white text-center">{driver.name}</h2>
        <button
          onClick={() => setShowEdit(true)}
          className="text-white hover:text-yellow-300 transition"
        >
          <FaEdit size={18} />
        </button>
      </div>

      {/* Driver Details */}
      <div className="text-sm text-white space-y-1 w-full mt-2">
        {[
          ["Phone", driver.phone_number],
          ["NIC", driver.nic],
          ["Charges", `Rs. ${driver.driver_charges || "0"}`],
          ["License No", driver.license_number],
          ["License Expiry", driver.license_expiry_date ? driver.license_expiry_date.split("T")[0] : "-"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="font-semibold w-36">{label}:</span>
            <span>{value || "-"}</span>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="w-full mt-4">
        <h3 className="text-sm font-bold text-white mb-2 text-center">Documents</h3>
        <div className="grid grid-cols-2 gap-2">
          {documents.filter(doc => doc.src).map(doc => (
            <div
              key={doc.label}
              className="flex flex-col text-white items-center border rounded-sm overflow-hidden shadow hover:shadow-md cursor-pointer p-1"
              onClick={() => openImage(doc.src)}
            >
              <img src={doc.src} alt={doc.label} className="w-20 h-20 object-cover rounded" />
              <span className="text-xs font-semibold mt-1">{doc.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverSidebar;
