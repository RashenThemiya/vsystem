// BillDashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

import StatsCards from "./StatsCards";
import ActionCards from "./ActionCards";
import BillTable from "./BillTable";
import AddBillModal from "./AddBillModal";
import BillSearchBar from "./BillSearchBar";
import UpdateOtherCostModal from "./UpdateOtherCostModal";

export default function BillDashboard() {
  const { name, role } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateCostModal, setShowUpdateCostModal] = useState(false);
  const [billForUpdate, setBillForUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  // Fetch bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/bill-uploads", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBills(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch bills");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  // Compute stats
  const stats = {
    total: bills.length,
    pending: bills.filter((b) => b.bill_status === "pending").length,
    completed: bills.filter((b) => b.bill_status === "completed").length,
    newThisMonth: bills.filter((b) => {
      const billDate = new Date(b.bill_date);
      const now = new Date();
      return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
    }).length,
  };

  // Filter bills
  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.bill_type || "").toLowerCase().includes(q) ||
      (b.vehicle_id?.toString() || "").includes(q) ||
      (b.driver_id?.toString() || "").includes(q)
    );
  });

  // Handlers
  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetails(true);
  };

  const handleEditBill = () => {
    setShowEditForm(true);
    setShowDetails(false);
  };

  const handleClosePanel = () => {
    setSelectedBill(null);
    setShowDetails(false);
    setShowEditForm(false);
  };

  const handleDeleteBill = (id) => {
    setBills((prev) => prev.filter((b) => b.bill_id !== id));
    setSelectedBill(null);
    setShowDetails(false);
  };

  const handleBillUpdated = (updatedBill) => {
    setBills((prev) =>
      prev.map((b) => (b.bill_id === updatedBill.bill_id ? updatedBill : b))
    );
    setSelectedBill(updatedBill);
    setShowEditForm(false);
    setSuccessMessage("Bill updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleOpenUpdateCost = (bill) => {
    setBillForUpdate(bill);
    setShowUpdateCostModal(true);
    setShowAddForm(false);
    
  };

  const handleUpdateCostSuccess = () => {
    setShowUpdateCostModal(false);
    setSuccessMessage("Vehicle Other Cost updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);

    // refresh bills
    const fetchBills = async () => {
      try {
        const res = await api.get("/api/bill-uploads", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBills(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBills();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Bill Management</h1>
              <p className="text-sm text-gray-500">Manage all uploaded bills</p>
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
                onAddBillClick={() => {
                  setShowAddForm(true);
                  setShowDetails(false);
                  setSelectedBill(null);
                  setShowUpdateCostModal(false);
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <BillSearchBar onSearch={setSearchQuery} />
          </div>

          {/* Table */}
          <div className="mt-8">
            <BillTable
              bills={filteredBills}
              loading={loading}
              error={error}
              onSelect={handleSelectBill}
              onUpdateCost={handleOpenUpdateCost}
            />
          </div>
        </div>
      </main>

      {/* Add Bill Modal */}
      {showAddForm && (
        <AddBillModal
          onClose={() => setShowAddForm(false)}
          onSuccess={(newBill) => {
            setBills([...bills, newBill]);
            setShowAddForm(false);
          }}
        />
      )}

      {showEditForm && selectedBill && (
        <AddBillModal
          bill={selectedBill}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleBillUpdated}
        />
      )}

      {/* Update Other Cost Modal */}
      {showUpdateCostModal && billForUpdate && (
        <UpdateOtherCostModal
          bill={billForUpdate}
          onClose={() => setShowUpdateCostModal(false)}
          onSuccess={handleUpdateCostSuccess}
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
