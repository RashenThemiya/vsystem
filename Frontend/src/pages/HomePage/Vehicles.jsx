import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { FaCar, FaBus, FaShuttleVan, FaMotorcycle } from "react-icons/fa";
import Header from "./Header";

const icons = {
  car: <FaCar className="text-3xl text-indigo-600" />,
  van: <FaShuttleVan className="text-3xl text-indigo-600" />,
  bus: <FaBus className="text-3xl text-indigo-600" />,
  bike: <FaMotorcycle className="text-3xl text-indigo-600" />,
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  {/*
  useEffect(() => {
    fetchVehicles();
  }, []);*/}

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/api/vehicles");
      setVehicles(res.data);
    } catch (err) {
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["car", "van", "bus", "bike"];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* ✅ HEADER */}
      <Header title="TRANSPORT" breadcrumb="Transport" />

      {/* PAGE CONTENT */}
      <div className="px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-indigo-900 mb-10 mt-10">
            Transport & Vehicles
          </h1>

          {loading && (
            <p className="text-center text-gray-500">Loading vehicles...</p>
          )}

          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!loading &&
            !error &&
            categories.map((cat) => {
              const list = vehicles.filter((v) => v.category === cat);
              if (!list.length) return null;

              return (
                <section key={cat} className="mb-14">
                  <div className="flex items-center mb-4 gap-2">
                    {icons[cat]}
                    <h2 className="text-2xl font-semibold capitalize text-indigo-800">
                      {cat}s
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((v) => (
                      <div
                        key={v.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                      >
                        <img
                          src={v.image || "/images/vehicle-placeholder.png"}
                          alt={v.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-indigo-700">
                            {v.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Seats: {v.seats || "-"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: Rs.{" "}
                            {v.price_per_km?.toLocaleString() || "-"}
                          </p>

                          <button className="mt-3 w-full bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition">
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </div>
  );
}
