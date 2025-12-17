import { FaArrowAltCircleLeft, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditVehicleForm from "../EditVehicle";

/* =========================
   Availability Badge
========================= */
const AvailabilityBadge = ({ status }) => {
  const isActive = status === "Yes";

  return (
    <span
      className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full
        ${isActive
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
        }`}
    >
      {isActive ? <FaCheckCircle /> : <FaTimesCircle />}
      {isActive ? "ACTIVE" : "INACTIVE"}
    </span>
  );
};

/* =========================
   Sidebar Component
========================= */
const Sidebar = ({ vehicle, openImage, refreshVehicle }) => {
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  const documents = [
    { label: "Vehicle", src: vehicle.image },
    { label: "License", src: vehicle.license_image },
    { label: "Insurance", src: vehicle.insurance_card_image },
    { label: "Eco Test", src: vehicle.eco_test_image },
    { label: "Book", src: vehicle.book_image },
  ];

  return (
    <div className="relative w-72 bg-gradient-to-r from-indigo-600 to-violet-700 shadow-lg rounded-xl p-4 flex flex-col items-center gap-4 overflow-y-auto sticky top-0 h-screen">

      {/* ================= Modal Overlay ================= */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <EditVehicleForm
            vehicle={vehicle}
            onCancel={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshVehicle(); // 🔥 refresh parent page
            }}
          />
        </div>
      )}

      {/* ================= Back Button ================= */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-3 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-full shadow hover:bg-gray-600"
      >
        <FaArrowAltCircleLeft size={20} />
      </button>

      {/* ================= Avatar ================= */}
      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="w-32 h-32 rounded-full border-2 border-gray-100 object-cover shadow-md mt-8"
      />

      {/* ================= Name + Edit ================= */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-white">{vehicle.name}</h2>
        <button
          onClick={() => setShowEdit(true)}
          className="text-white hover:text-yellow-300"
        >
          <FaEdit size={18} />
        </button>
      </div>

      {/* ================= Vehicle Info ================= */}
      <div className="text-sm text-white space-y-1 w-full">

        {[
          ["Number", vehicle.vehicle_number],
          ["Type", vehicle.type],
          ["Daily Rent", `Rs. ${vehicle.rent_cost_daily}`],
          ["AC", vehicle.ac_type],
          ["Owner Cost/Month", `Rs. ${vehicle.owner_cost_monthly}`],
          ["Fuel", vehicle.fuel?.type],
          ["Fuel Cost", `Rs. ${vehicle.fuel?.cost}`],
          ["Efficiency", `${vehicle.vehicle_fuel_efficiency} km/L`],
          ["Meter", `${vehicle.meter_number} km`],
          ["Last Service", `${vehicle.last_service_meter_number} km`],
          ["Owner", vehicle.owner?.owner_name],
          ["Mileage Cost", `Rs. ${vehicle.mileage_costs?.[0]?.mileage_cost}`],
          ["Additional Mileage", `Rs. ${vehicle.mileage_costs?.[0]?.mileage_cost_additional}`],
          ["License Expiry", vehicle.license_expiry_date?.split("T")[0]],
          ["Insurance Expiry", vehicle.insurance_expiry_date?.split("T")[0]],
          ["ECO Test Expiry", vehicle.eco_test_expiry_date?.split("T")[0]],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="font-semibold w-40">{label}:</span>
            <span>{value || "-"}</span>
          </div>
        ))}

        {/* ===== Availability (Custom Badge) ===== */}
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold w-40">Availability:</span>
          <AvailabilityBadge status={vehicle.vehicle_availability} />
        </div>

      </div>

      {/* ================= Documents ================= */}
      <div className="w-full mt-4">
        <h3 className="text-sm font-bold text-white mb-2 text-center">Documents</h3>
        <div className="grid grid-cols-3 gap-2">
          {documents
            .filter((doc) => doc.src)
            .map((doc) => (
              <div
                key={doc.label}
                className="flex flex-col text-white items-center border rounded-sm overflow-hidden shadow hover:shadow-md cursor-pointer p-1"
                onClick={() => openImage(doc.src)}
              >
                <img
                  src={doc.src}
                  alt={doc.label}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="text-xs font-semibold mt-1">{doc.label}</span>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
