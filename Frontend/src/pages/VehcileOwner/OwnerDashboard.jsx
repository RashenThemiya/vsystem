// OwnerDashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import StatsCards from "./StatsCards"; // can reuse StatsCards
import ActionCards from "./ActionCards"; // can reuse ActionCards
import OwnerTable from "./OwnerTable"; // reuse table component (or make OwnerTable)
import AddOwner from "./AddOwner";
import OwnerSearchBar from "./SearchBar"; // create a search bar for owners
import OwnerDetails from "./OwnerDetails";
import EditOwnerForm from "./EditOwnerForm";

export default function OwnerDashboard() {
  const { name, role } = useAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/owners", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setOwners(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch owners");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const stats = {
    total: owners.length,
    // you can adjust logic if you have other fields
    newThisMonth: owners.filter((o) => {
      if (!o.created_at) return false;
      const created = new Date(o.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  const filteredOwners = owners.filter((o) => {
    const q = searchQuery.toLowerCase();
    return o.owner_name?.toLowerCase().includes(q) || o.contact_number?.toLowerCase().includes(q);
  });

  const handleSelectOwner = (owner) => {
    setSelectedOwner(owner);
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetails(true);
  };

   const handleEditOwner = () => {
    setShowEditForm(true);
  };

  const handleClosePanel = () => {
    setSelectedOwner(null);
    setShowDetails(false);
  };

  const handleDeleteOwner = (id) => {
    setOwners((prev) => prev.filter((o) => o.owner_id !== id));
    setSelectedOwner(null);
    setShowDetails(false);
  };

  const handleOwnerUpdated = (updatedOwner) => {
    setOwners((prev) => prev.map((o) => (o.owner_id === updatedOwner.owner_id ? updatedOwner : o)));
    setSelectedOwner(updatedOwner);
    setShowEditForm(false);
    setSuccessMessage("Owner updated successfully!");
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
              <h1 className="text-2xl font-semibold">Vehicle Owner Management</h1>
              <p className="text-sm text-gray-500">Manage vehicle owners and their contact info</p>
            </div>
            <div className="text-sm text-gray-600">Signed in as <span className="font-medium">{name}</span> — {role}</div>
          </div>

          {/* Stats + Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mt-6 items-stretch">
            <div className="lg:col-span-3 h-full">
              <StatsCards stats={stats} />
            </div>
            <div className="lg:col-span-1 h-full flex flex-col">
              <ActionCards
                onAddOwnerClick={() => {
                  setShowAddForm(true);
                  setShowDetails(false);
                  setSelectedOwner(false);
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <OwnerSearchBar onSearch={(value) => setSearchQuery(value)} />
          </div>

          {/* Table */}
          <div className="mt-8">
            <OwnerTable // reuse CustomerTable for now, can rename to OwnerTable
              owners={filteredOwners}
              loading={loading}
              error={error}
              onSelectOwner={handleSelectOwner}
            />
          </div>
        </div>
      </main>

      {/* Add Owner Modal */}
      {showAddForm && (
        <AddOwner
          onCancel={() => setShowAddForm(false)}
          onSuccess={(newOwner) => {
            setOwners([...owners, newOwner]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Edit Owner Modal */}
      {showEditForm && selectedOwner && (
        <EditOwnerForm
          owner={selectedOwner}
          onCancel={() => setShowEditForm(false)}
          onSuccess={handleOwnerUpdated}
        />
      )}

      {/* Owner Details Panel */}
      {selectedOwner && !showEditForm && showDetails &&(
        <OwnerDetails
          owner={selectedOwner}
          onClose={handleClosePanel}
          onDelete={handleDeleteOwner}
          onUpdated={handleOwnerUpdated}
          onEdit={handleEditOwner}
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
