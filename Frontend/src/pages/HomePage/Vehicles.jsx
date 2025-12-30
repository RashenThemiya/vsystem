import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { FaCar, FaBus, FaShuttleVan, FaMotorcycle } from "react-icons/fa";
import Header from "./Header";

const icons = {
  Car: <FaCar className="text-3xl text-indigo-600" />,
  Van: <FaShuttleVan className="text-3xl text-indigo-600" />,
  Bus: <FaBus className="text-3xl text-indigo-600" />,
  Bike: <FaMotorcycle className="text-3xl text-indigo-600" />,
};

// Hardcoded seat counts
const seatCounts = {
  Car: "3-4",
  Van: "7-8",
  Bus: "20+",
  Bike: "1-2",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVehicle, setActiveVehicle] = useState(null);

const handleViewDetails = (vehicle) => {
  setActiveVehicle(vehicle);
};


  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/api/vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVehicles(res.data);
    } catch (err) {
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Car", "Van", "Bus", "Bike"];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header title="TRANSPORT" breadcrumb="Transport" />

      <div className="px-6 py-14">
        <div className="max-w-7xl mx-auto">
          {/* HERO SECTION */}
          <section className="relative w-full h-[50vh] overflow-hidden mb-7">
          <div className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out animate-slide">
          <img src="/images/vehiclebg.jpeg" className="w-full h-full object-cover flex-shrink-0" />
          </div>


          <div className="absolute inset-0 bg-black/40"></div>


          <div className="relative text-left text-white px-6 max-w-3xl mx-auto top-1/2 -translate-y-1/2">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Transport & Vehicles</h1>
  
          </div>
          </section>

          {loading && <p className="text-center text-gray-500">Loading vehicles...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading &&
            !error &&
            categories.map((cat) => {
              const list = vehicles.filter((v) => v.type === cat);
              if (!list.length) return null;

              return (
                <section key={cat} className="mb-14">
                  <div className="flex items-center mb-4 gap-2">
                    {icons[cat]}
                    <h2 className="text-2xl font-semibold capitalize text-indigo-800">
                      {cat}s
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {list.map((v) => (
    <div
      key={v.vehicle_id}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-2xl"
    >
      {/* IMAGE + OVERLAY */}
      <div className="relative h-64 overflow-hidden group cursor-pointer">
        <img
          src={v.image ? v.image : "/images/vehicle-placeholder.png"}
          alt={v.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Gradient at bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Info Overlay */}
        <div className="absolute bottom-4 left-4 text-white space-y-1">
          <h3 className="text-xl font-semibold">{v.name}</h3>
          <p className="text-sm">
            Seats: <span className="font-medium">{seatCounts[cat]}</span>
          </p>
          <p className="text-sm">
            Fuel: <span className="font-medium">{v.fuel?.type || "-"}</span>
          </p>
          <p className="text-sm">
            Daily: <span className="font-medium">Rs. {v.rent_cost_daily?.toLocaleString() || "-"}</span>
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => handleViewDetails(v)}
          className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition"
        >
          View Details
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-4">
        <p className="text-indigo-800 font-semibold text-lg">{v.type}</p>
      </div>
    </div>
  ))}
</div>

                </section>
              );
            })}
        </div>
      </div>
      {activeVehicle && (
  <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
    <div className="bg-white w-full max-w-md h-full p-6 overflow-auto">
      <button
        onClick={() => setActiveVehicle(null)}
        className="text-gray-600 text-xl mb-4"
      >
        ✕ Close
      </button>

      <img
        src={activeVehicle.image || "/images/vehicle-placeholder.png"}
        alt={activeVehicle.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <h2 className="text-2xl font-bold text-indigo-800">
        {activeVehicle.name}
      </h2>
      <p className="text-gray-600 mb-3">Type: {activeVehicle.type}</p>
      <p className="text-gray-600">Seats: {seatCounts[activeVehicle.type]}</p>
      <p className="text-gray-600">Fuel: {activeVehicle.fuel?.type || "-"}</p>
      <p className="text-gray-600">
        Daily Rent: Rs. {activeVehicle.rent_cost_daily?.toLocaleString() || "-"}
      </p>

      {/* Add any extra info / button here */}
      <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold">
        Book This Vehicle
      </button>
    </div>
  </div>
)}

    </div>
  );
}

