import { useState, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const AddDriver = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState({
    name: "",
    phone_number: "",
    driver_charges: "",
    nic: "",
    age: "",
    license_number: "",
    license_expiry_date: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { name: loggedUser, role } = useAuth();

  // auto clear error after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  // Convert selected image to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setDriver((prev) => ({
        ...prev,
        image: reader.result.split(",")[1], // remove prefix
      }));
    };
    reader.readAsDataURL(file);
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
      const payload = {
        ...driver,
        driver_charges: parseFloat(driver.driver_charges),
        age: parseInt(driver.age),
        image: driver.image ? `data:image/png;base64,${driver.image}` : null,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/drivers`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setDriver({
          name: "",
          phone_number: "",
          driver_charges: "",
          nic: "",
          age: "",
          license_number: "",
          license_expiry_date: "",
          image: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
          navigate("/driver-management");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding driver:", error);
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
          Add New Driver
        </h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            ✅ Driver added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Driver Name"
            value={driver.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number (e.g., 0712345678)"
            value={driver.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="number"
            name="driver_charges"
            placeholder="Driver Charges (LKR)"
            value={driver.driver_charges}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            name="nic"
            placeholder="NIC Number"
            value={driver.nic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={driver.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            name="license_number"
            placeholder="License Number"
            value={driver.license_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              License Expiry Date
            </label>
            <input
              type="date"
              name="license_expiry_date"
              value={driver.license_expiry_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Driver Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Confirm Adding Driver"
            additionalInfo="Please verify the driver details before submission."
            confirmText="Yes, Add Driver"
            cancelText="No, Go Back"
            icon={<FiUserPlus />}
            buttonBackgroundColor="bg-blue-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Driver"}
            </button>
          </ConfirmWrapper>

          <button
            type="button"
            onClick={() => navigate("/driver-management")}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
