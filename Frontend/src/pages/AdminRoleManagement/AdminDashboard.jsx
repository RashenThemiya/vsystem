// AdminDashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";


import StatsCards from "./StatsCards";
import ActionCards from "./ActionCards";
import AdminTable from "./AdminTable";
import AddAdminForm from "./AddAdminRole";
import AdminSearchBar from "./SearchBar";

export default function AdminDashboard() {
  const { name, role } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get("/api/admin-roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const adminList = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAdmins(adminList);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError(
          err.response?.data?.message || "Failed to fetch admin data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Stats
  const stats = {
    total: admins.length,
    active: admins.filter((a) => a.status === "active").length,
    inactive: admins.filter((a) => a.status === "inactive").length,
    newThisMonth: admins.filter((a) => {
      if (!a.created_at) return false;
      const created = new Date(a.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  // Search
  const filteredAdmins = admins.filter((a) => {
  const q = searchQuery.toLowerCase();
  return (
    a.email.toLowerCase().includes(q) ||
    (a.role && a.role.toLowerCase().includes(q))
  );
});


  // Select admin
  const handleSelectAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleEditAdmin = () => {
    setShowEditForm(true);
  };

  const handleClosePanel = () => {
    setSelectedAdmin(null);
    setShowEditForm(false);
  };

  const handleDeleteAdmin = async (admin) => {
  if (!admin) return;

  setLoading(true);
  setError(null);

  try {
    // Call the backend API to delete
    await api.delete(`/api/admin-roles/${admin.admin_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // Remove the admin from state
    setAdmins((prev) => prev.filter((a) => a.admin_id !== admin.admin_id));
    setSelectedAdmin(null);

    setSuccessMessage("Admin deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 2000);

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to delete admin.");
  } finally {
    setLoading(false);
  }
};


  const handleAdminUpdated = (updatedAdmin) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
    );
    setSelectedAdmin(updatedAdmin);
    setShowEditForm(false);
    setSuccessMessage("Admin updated successfully!");
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
              <h1 className="text-2xl font-semibold">Admin Management</h1>
              <p className="text-sm text-gray-500">Manage all admins in the system</p>
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
                onAddAdminClick={() => {
                  setShowAddForm(true);
                  setSelectedAdmin(null);
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <AdminSearchBar onSearch={(value) => setSearchQuery(value)} />
          </div>

          {/* Table */}
          <div className="mt-8">
            <AdminTable
              admins={filteredAdmins}
              loading={loading}
              error={error}
              //onSelectAdmin={handleSelectAdmin}
              //onEditAdmin={handleEditAdmin}
              onDeleteAdmin={handleDeleteAdmin}
            />
          </div>
        </div>
      </main>

      {/* Add Admin Modal */}
      {showAddForm && (
          <AddAdminForm
            onCancel={() => setShowAddForm(false)}
            onClose={() => setShowAddForm(false)}
            onSuccess={(newAdmin) => {
              setAdmins([newAdmin, ...admins]);
              setShowAddForm(false);
            }}
          />
        
      )}

      {/* Edit Admin Modal */}
      {/*showEditForm && selectedAdmin && (
        
          <EditAdminForm
            admin={selectedAdmin}
            onCancel={handleClosePanel}
            onSuccess={handleAdminUpdated}
          />
        
      )*/}
      
      {/* Admin Details / Edit Panel */}
      {/*selectedAdmin && !showEditForm && (
        <AdminDetails
          admin={selectedAdmin}
          onClose={handleClosePanel}
          onDelete={handleDeleteAdmin}
          onEdit={() => setShowEditForm(true)}
        />
      )*/}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
}
