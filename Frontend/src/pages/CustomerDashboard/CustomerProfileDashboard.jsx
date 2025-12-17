import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa"; // Phone icon
import api from "../../utils/axiosInstance";
import KpiDashboard from "./KpiDashboard";
import Sidebar from "./SideBar";
import TripsTable from "./TripTable";

const CustomerProfileDashboard = () => {
  const { customerID } = useParams();

  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/customers/${customerID}`);
      setCustomer(res.data.data);
    } catch {
      setError("Failed to fetch customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerID]);

  const handleCall = () => {
    alert("Calling Ceylon Places now! 📞"); // Replace with actual action if needed
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!customer) return <p className="p-6">Customer not found</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 min-h-screen relative">
      <Sidebar
        customer={customer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1">
        {activeTab === "dashboard" && (
          <KpiDashboard
            customerID={customerID}
            customerName={customer.name}
          />
        )}

        {activeTab === "trips" && (
          <TripsTable trips={customer.trips || []} />
        )}

        {activeTab === "payments" && (
          <div className="bg-white p-6 rounded-xl shadow">
            Payments component goes here
          </div>
        )}
      </div>

      {/* Floating Call Button */}
      <button
        onClick={handleCall}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-50 flex items-center justify-center"
        title="Call Ceylon Places"
      >
        <FaPhoneAlt size={20} />
      </button>
    </div>
  );
};

export default CustomerProfileDashboard;
