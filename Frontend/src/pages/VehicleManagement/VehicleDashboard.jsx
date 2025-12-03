// VehicleDashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import ModalWrapper from "../../components/ModelWrapper";

import StatsCards from "./StatsCards";
import ActionCards from "./ActionCards";
import VehicleTable from "./VehicleTable";
import AddVehicle from "./AddVehicle";
import VehicleSearchBar from "./SearchBar";
import VehicleDetails from "./VehicleDetails";
import EditVehicleForm from "./EditVehicle";

export default function VehicleDashboard() {
  const { name, role } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/vehicles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("API Response:", res.data);
        const data = Array.isArray(res.data) ? res.data : [];
        setVehicles(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Stats
  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === "available").length,
    rented: vehicles.filter((v) => v.status === "rented").length,
    newThisMonth: vehicles.filter((v) => {
      if (!v.created_at) return false;
      const created = new Date(v.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  // Search
  const filteredVehicles = vehicles.filter((v) => {
  const q = searchQuery.toLowerCase();
  return (
    (v.vehicle_number || "").toLowerCase().includes(q) ||
    (v.name || "").toLowerCase().includes(q) ||
    (v.type || "").toLowerCase().includes(q)
  );
});


  // Select vehicle
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetails(true);
  };

  const handleEditVehicle = () => {
    setShowEditForm(true);
    setShowDetails(false);
  };

  const handleClosePanel = () => {
    setSelectedVehicle(null);
    setShowDetails(false);
  };

  // Delete vehicle
  const handleDeleteVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.vehicle_id !== id));
    setSelectedVehicle(null);
    setShowDetails(false);
  };

  // Update vehicle
  const handleVehicleUpdated = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.vehicle_id === updatedVehicle.vehicle_id ? updatedVehicle : v))
    );

    setSelectedVehicle(updatedVehicle);
    setShowEditForm(false);
    setSuccessMessage("Vehicle updated successfully!");

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Vehicle Management</h1>
              <p className="text-sm text-gray-500">Manage all vehicles in the system</p>
            </div>
            <div className="text-sm text-gray-600">
              Signed in as <span className="font-medium">{name}</span> — {role}
            </div>
          </div>

          {/* Stats + Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mt-6 items-stretch">
            <div className="lg:col-span-3 h-full">
              <StatsCards stats={stats} />
            </div>

            <div className="lg:col-span-1 h-full flex flex-col">
              <ActionCards
                onAddVehicleClick={() => {
                  setShowAddForm(true);
                  setShowDetails(false);
                  setSelectedVehicle(null);
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <VehicleSearchBar onSearch={(value) => setSearchQuery(value)} />
          </div>

          {/* Table */}
          <div className="mt-8">
            <VehicleTable
              vehicles={filteredVehicles}
              loading={loading}
              error={error}
              onSelectVehicle={handleSelectVehicle}
              
            />
          </div>
        </div>
      </main>

      {/* Add Vehicle Modal */}
      {showAddForm && (
      <ModalWrapper onClose={() => setShowAddForm(false)}>
        <AddVehicle
          onCancel={() => setShowAddForm(false)}
          onClose={() => setShowAddForm(false)}
          onSuccess={(newVehicle) => {
            setVehicles([...vehicles, newVehicle]);
            setShowAddForm(false);
          }}
        />
      </ModalWrapper>
    )}


      {/* Edit Vehicle Modal */}
      {showEditForm && selectedVehicle && (
        <ModalWrapper onClose={() => setShowEditForm(false)}>
          <EditVehicleForm
            vehicle={selectedVehicle}
            onCancel={() => setShowEditForm(false)}
            onSuccess={handleVehicleUpdated}
          />
        </ModalWrapper>
      )}

      {/* Vehicle Details Panel */}
      {selectedVehicle && !showEditForm && showDetails && (
        <VehicleDetails
          vehicle={selectedVehicle}
          onClose={handleClosePanel}
          onDelete={handleDeleteVehicle}
          onUpdated={handleVehicleUpdated}
          onEdit={handleEditVehicle}
        />
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
}
