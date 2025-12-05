    // CustomerDashboard.jsx
    import { useEffect, useState } from "react";
    import Sidebar from "../../components/Sidebar";
    import api from "../../utils/axiosInstance";
    import { useAuth } from "../../context/AuthContext";
    import StatsCards from "../Customers/StatsCards";
    import ActionCards from "../Customers/ActionCards";
    import CustomerTable from "../Customers/CustomerTable";
    import AddCustomerForm from "./AddCustomer";
    import CustomerSearchBar from "./SearchBar";
    import CustomerDetails from "./CustomerDetails";
    import EditCustomerForm from "./EditCustomerForm";
    

    export default function CustomerDashboard() {
    const { name, role } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");



    useEffect(() => {
        const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/customers", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setCustomers(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch customers");
        } finally {
            setLoading(false);
        }
        };

        fetchCustomers();
    }, []);

    // compute simple stats; adjust logic to match your backend fields
    const stats = {
        total: customers.length,
        active: customers.filter((c) => c.status === "active").length,
        pro: customers.filter((c) => c.subscription === "pro").length,
        newThisMonth: customers.filter((c) => {
        if (!c.created_at) return false;
        const created = new Date(c.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length,
    };

    const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();

    return (
        c.name?.toLowerCase().includes(q) ||
        c.nic?.toLowerCase().includes(q) ||
        c.phone_number?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
    });


    // handlers
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const handleEditCustomer = () => {
    setShowEditForm(true);  
    };


    const handleClosePanel = () => setSelectedCustomer(null);

    const handleDeleteCustomer = (id) => {
        // Optimistic removal here, actual deletion can be implemented or delegated
        setCustomers((prev) => prev.filter((c) => c.customer_id !== id));
        setSelectedCustomer(null);
    };

    const handleCustomerUpdated = (updatedCustomer) => {
    setCustomers((prev) =>
    prev.map((c) =>
      c.customer_id === updatedCustomer.customer_id ? updatedCustomer : c
    )
    );

    setSelectedCustomer(updatedCustomer);
    setShowEditForm(false);
    setSuccessMessage("Customer updated successfully!");
    // Hide success message after 3 seconds
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
                <h1 className="text-2xl font-semibold">Customer Management</h1>
                <p className="text-sm text-gray-500">Manage customers and related information</p>
                </div>
                <div className="text-sm text-gray-600">Signed in as <span className="font-medium">{name}</span> — {role}</div>
            </div>

            {/* Stats + Actions side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mt-6 items-stretch">

            {/* Stats Section - takes 3 columns */}
            <div className="lg:col-span-3 h-full">
                <div className="h-full">
                <StatsCards stats={stats} />
                </div>
            </div>

            {/* Actions Section - takes 1 column */}
            <div className="lg:col-span-1 h-full">
                <div className="h-full flex flex-col">
                <ActionCards onAddCustomerClick={() => {
                    setShowAddForm(true);
                    setShowDetails(false);
                    setSelectedCustomer(false);
                    }} />
                </div>
            </div>

            </div>

            {/* Search Bar */}
            <div className="mt-6">
            <CustomerSearchBar onSearch={(value) => setSearchQuery(value)} />
            </div>

            {/* Table */}
            <div className="mt-8">
                <CustomerTable
                customers={filteredCustomers}
                loading={loading}
                error={error}
                onSelectCustomer={handleSelectCustomer}
                />
            </div>
            </div>
        </main>

        {/* Add Customer Modal */}
        {showAddForm && (
        <AddCustomerForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={(newCustomer) => {
            setCustomers([...customers, newCustomer]); // add new customer to list
            setShowAddForm(false); // close modal
          }}
        />
        )}

        {/* Edit Customer Modal */}
        {showEditForm && selectedCustomer && (
        <EditCustomerForm
        customer={selectedCustomer}
        onCancel={() => setShowEditForm(false)}
        onSuccess={handleCustomerUpdated}
        />
        )}

        {/* Customer Details Slide-in Panel */}
        {selectedCustomer && !showEditForm && (
        <CustomerDetails
            customer={selectedCustomer}
            onClose={handleClosePanel}
            onDelete={handleDeleteCustomer}
            onUpdated={handleCustomerUpdated} // ← triggers edit mode
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
