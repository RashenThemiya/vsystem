import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import DriverSidebar from "./DriverProfileComponent/DriverSidebar";
import DriverTripsTab from "./DriverProfileComponent/DriverTripsTab";

const DriverProfile = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    fetchDriver();
  }, [driverId]);

  const fetchDriver = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/drivers/${driverId}`);
      setDriver(res.data.data);
    } catch (err) {
      setError("Failed to fetch driver details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-3">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="text-sm font-semibold text-gray-700">
        Loading driver details...
      </p>
    </div>
  </div>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!driver) return <p className="p-6">No driver found.</p>;

  return (
    <div className="flex gap-6 p-4">
      <DriverSidebar driver={driver} openImage={setZoomImage}  refreshDriver={fetchDriver}/>
      <DriverTripsTab trips={driver.trips || []} />

      {/* Zoom modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="Zoom" className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl" />
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
