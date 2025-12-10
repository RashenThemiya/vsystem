import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

import CustomerSidebar from "../Customers/CustomerProfileComponent/CustomerSidebar";
import CustomerTripsTable from "../Customers/CustomerProfileComponent/CustomerTripsTable";

const CustomerProfile = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/customers/${customerId}`);
        setCustomer(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch customer.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!customer) return <p className="p-6 text-center">Customer not found.</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      {/* Sidebar */}
      <CustomerSidebar customer={customer} openImage={setZoomImage} />

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

        <CustomerTripsTable trips={customer.trips || []} />
      </div>
    </div>
  );
};

export default CustomerProfile;
