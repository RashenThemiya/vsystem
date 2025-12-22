import { useEffect, useState } from "react";
import { Bell, X, AlertTriangle } from "lucide-react";
import axios from "../../utils/axiosInstance"; // your axios instance

const priorityStyles = {
  HIGH: "bg-red-100 text-red-700 border-red-300",
  MEDIUM: "bg-orange-100 text-orange-700 border-orange-300",
  LOW: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const ExpiryNotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("api/dashboard/vehicle-expiry");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to load expiry notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      {/* 🔔 Notification Icon */}
      <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </div>

      {/* 🧾 Slide Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
          <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="text-red-600" />
                Vehicle Expiry Alerts
              </h2>
              <X
                className="cursor-pointer text-gray-600"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {loading && <p className="text-sm text-gray-500">Loading...</p>}

              {!loading && notifications.length === 0 && (
                <p className="text-sm text-gray-500">
                  No expiry notifications 🎉
                </p>
              )}

              {notifications.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 ${priorityStyles[item.priority]}`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">
                      {item.vehicle_number}
                    </h4>
                    <span className="text-xs font-bold">
                      {item.priority}
                    </span>
                  </div>

                  <p className="text-sm mt-1">
                    <strong>Type:</strong> {item.expiry_type}
                  </p>

                  <p className="text-sm">
                    <strong>Expiry Date:</strong>{" "}
                    {new Date(item.expiry_date).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    <strong>Days Remaining:</strong>{" "}
                    {item.days_remaining}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpiryNotificationPanel;
