import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const AddAdminRole = ({onClose, onSuccess}) => {
  const navigate = useNavigate();
  const { name: loggedUser, role } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Admin",
    driver_id: null,
    customer_id: null,
  });

  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available drivers & customers without admin accounts
  useEffect(() => {
    const fetchWithoutAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized! Please log in first.");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin-roles/without-admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDrivers(res.data.data.drivers || []);
        setCustomers(res.data.data.customers || []);
      } catch (err) {
        console.error("Error fetching available users:", err);
        setError("Failed to fetch available users.");
      }
    };

    fetchWithoutAdmin();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle role selection logic
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
      driver_id: selectedRole === "Driver" ? prev.driver_id : null,
      customer_id: selectedRole === "Customer" ? prev.customer_id : null,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        driver_id: formData.role === "Driver" ? formData.driver_id : null,
        customer_id: formData.role === "Customer" ? formData.customer_id : null,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin-roles`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        onSuccess(res.data.data);
        setTimeout(() => {
          setSuccess(false);
          
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating admin role:", err);
      setError(
        err.response?.data?.message || "Failed to create admin role. Try again."
      );
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    handleSubmit(new Event("submit"));
  };

  const handleCancelConfirm = () => {
    setIsConfirmed(false);
  };

  return (
    <div className="flex justify-center items-center w-100 min-h-screen bg-white-100">
      <div className="bg-white p-10 rounded-lg shadow-lg  h-full w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Create New Admin Role
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4 text-center">
            ✅ Admin role created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          {/* Role */}
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Driver">Driver</option>
            <option value="Customer">Customer</option>
          </select>

          {/* Select Driver */}
          {formData.role === "Driver" && (
            <select
              name="driver_id"
              value={formData.driver_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  driver_id: Number(e.target.value),
                })
              }
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="">Select a Driver (without account)</option>
              {drivers.map((driver) => (
                <option key={driver.driver_id} value={driver.driver_id}>
                  {driver.name} — {driver.phone_number}
                </option>
              ))}
            </select>
          )}

          {/* Select Customer */}
          {formData.role === "Customer" && (
            <select
              name="customer_id"
              value={formData.customer_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer_id: Number(e.target.value),
                })
              }
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="">Select a Customer (without account)</option>
              {customers.map((customer) => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.name} — {customer.phone_number}
                </option>
              ))}
            </select>
          )}

          {/* Confirm Wrapper */}
          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancelConfirm}
            message="Confirm Creating Admin Role"
            additionalInfo="Please double-check the email, password, and role details."
            confirmText="Yes, Create"
            cancelText="No, Cancel"
            icon={<FiUserPlus />}
            buttonBackgroundColor="bg-blue-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Admin Role"}
            </button>
          </ConfirmWrapper>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdminRole;
