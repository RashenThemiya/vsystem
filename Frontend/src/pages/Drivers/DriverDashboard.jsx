    // CustomerDashboard.jsx
    import { useEffect, useState } from "react";
    import Sidebar from "../../components/Sidebar";
    import api from "../../utils/axiosInstance";
    import { useAuth } from "../../context/AuthContext";
    import StatsCards from "../Drivers/StatsCards";
    import ActionCards from "../Drivers/ActionCards";
    import DriverTable from "../Drivers/DriverTable";
    import AddDriverForm from "./AddDriver";
    import DriverSearchBar from "./SearchBar";
    import DriverDetails from "./DriverDetails";
    import EditDriverForm from "./EditDriverForm";
    

    export default function DriverDashboard() {
  const { name, role } = useAuth();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/drivers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setDrivers(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Compute basic stats
  const stats = {
    total: drivers.length,
    active: drivers.filter((d) => d.status === "active").length,
    inactive: drivers.filter((d) => d.status === "inactive").length,
    assigned: drivers.filter((d) => d.assigned_vehicle).length,
  };

  // Search filter
  const filteredDrivers = drivers.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.nic?.toLowerCase().includes(q) ||
      d.phone_number?.toLowerCase().includes(q)
    );
  });

  // Select driver → opens details panel
  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetails(true);
  };

  // Open edit form
  const handleEditDriver = () => {
    setShowEditForm(true);
  };

  // Close detail panel
  const handleClosePanel = () => {
    setSelectedDriver(null);
    setShowDetails(false);
  };

  // Delete
  const handleDeleteDriver = (id) => {
    setDrivers((prev) => prev.filter((d) => d.driver_id !== id));
    setSelectedDriver(null);
    setShowDetails(false);
  };

  // Update
  const handleDriverUpdated = (updatedDriver) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.driver_id === updatedDriver.driver_id ? updatedDriver : d
      )
    );

    setSelectedDriver(updatedDriver);
    setShowEditForm(false);
    setSuccessMessage("Driver updated successfully!");

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Driver Management</h1>
              <p className="text-sm text-gray-500">Manage drivers and all driver-related data</p>
            </div>

            <div className="text-sm text-gray-600">
              Signed in as <span className="font-medium">{name}</span> — {role}
            </div>
          </div>

          {/* Stats + Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mt-6 items-stretch">

            {/* Stats Section */}
            <div className="lg:col-span-3 h-full">
              <StatsCards stats={stats} />
            </div>

            {/* Actions */}
            <div className="lg:col-span-1 h-full">
              <ActionCards
                onAddDriverClick={() => {
                  setShowAddForm(true);
                  setShowDetails(false);
                  setSelectedDriver(null);
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <DriverSearchBar onSearch={(value) => setSearchQuery(value)} />
          </div>

          {/* Table */}
          <div className="mt-8">
            <DriverTable
              drivers={filteredDrivers}
              loading={loading}
              error={error}
              onSelectDriver={handleSelectDriver}
            />
          </div>
        </div>
      </main>

      {/* Add Driver Modal */}
      {showAddForm && (
        <AddDriverForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={(newDriver) => {
            setDrivers([...drivers, newDriver]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Edit Driver Modal */}
      {showEditForm && selectedDriver && (
        <EditDriverForm
          driver={selectedDriver}
          onCancel={() => setShowEditForm(false)}
          onSuccess={handleDriverUpdated}
        />
      )}

      {/* Driver Details Panel */}
      {selectedDriver && showDetails && !showEditForm && (
        <DriverDetails
          driver={selectedDriver}
          onClose={handleClosePanel}
          onDelete={handleDeleteDriver}
          onUpdated={handleDriverUpdated}
          onEdit={handleEditDriver}
        />
      )}

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
}
