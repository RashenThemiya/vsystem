import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!customer) return <p className="p-6">Customer not found</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 min-h-screen">
      <Sidebar
        customer={customer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1">
        {activeTab === "dashboard" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Customer Overview</h2>
            <p>Name: {customer.name}</p>
            <p>Email: {customer.email}</p>
            <p>Total Trips: {customer.trips?.length || 0}</p>
          </div>
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
    </div>
  );
};

export default CustomerProfileDashboard;
