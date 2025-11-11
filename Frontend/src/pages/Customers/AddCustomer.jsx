import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    nic: "",
    nic_photo_front: "",
    nic_photo_back: "",
    phone_number: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { name: loggedUser, role } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert image to Base64
        setCustomer((prev) => ({
          ...prev,
          [name]: reader.result.split(",")[1], // remove "data:image/png;base64,"
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/customers`,
        customer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setCustomer({
          name: "",
          nic: "",
          nic_photo_front: "",
          nic_photo_back: "",
          phone_number: "",
          email: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
          navigate("/customer-management");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
            `Error: ${error.response.status} ${error.response.statusText}`
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    handleSubmit(new Event("submit"));
  };

  const handleCancel = () => {
    setIsConfirmed(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Customer
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            ✅ Customer added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={customer.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            name="nic"
            placeholder="NIC Number"
            value={customer.nic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          {/* NIC Front Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              NIC Front Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="nic_photo_front"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* NIC Back Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              NIC Back Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="nic_photo_back"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number (e.g., 0712345678)"
            value={customer.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Confirm Adding Customer"
            additionalInfo="Please verify the details before submission."
            confirmText="Yes, Add Customer"
            cancelText="No, Go Back"
            icon={<FiUserPlus />}
            buttonBackgroundColor="bg-green-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Customer"}
            </button>
          </ConfirmWrapper>

          <button
            type="button"
            onClick={() => navigate("/customer-management")}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
