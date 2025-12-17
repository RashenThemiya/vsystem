import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

import Sidebar from "./SideBar";
import TripsTable from "./TripTable";

const CustomerProfileDashboard = () => {
  const { customerID } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/customers/${customerID}`);
      setCustomer(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerID]);
  if (loading) return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-3">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="text-sm font-semibold text-gray-700">
        Loading customer details...
      </p>
    </div>
  </div>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!customer) return <p className="p-6 text-center">Customer not found.</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      {/* Sidebar */}
      <Sidebar customer={customer} openImage={setZoomImage} refreshCustomer={fetchCustomer} />

      {/* Main Content */}
      <div className="flex-1">
        {zoomImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
            />
          </div>
        )}

        <TripsTable trips={customer.trips || []} />
      </div>
    </div>
  );
};

export default CustomerProfileDashboard;
