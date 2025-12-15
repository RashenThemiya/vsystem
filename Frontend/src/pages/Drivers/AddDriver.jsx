import { useState, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import { FaTimes } from "react-icons/fa";


const AddDriver = ({ onCancel, onSuccess }) => {
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

  // validation errors
  const [nicError, setNicError] = useState("");
  const [contactError, setContactError] = useState("");
  const [ageError, setAgeError] = useState("");

  const [isConfirmed, setIsConfirmed] = useState(false);
  const { name: loggedUser, role } = useAuth();

  // Auto clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Validation functions
  const validateNIC = (nic) => {
    const oldNIC = /^[0-9]{9}[vVxX]$/;
    const newNIC = /^[0-9]{12}$/;
    return oldNIC.test(nic) || newNIC.test(nic);
  };

  const validateContact = (num) => {
    return /^0[0-9]{9}$/.test(num);
  };

  const validateAge = (age) => {
    return age >= 18 && age <= 80;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // NIC Validation
    if (name === "nic") {
      setDriver({ ...driver, [name]: value });
      if (value === "" || validateNIC(value)) {
        setNicError("");
      } else {
        setNicError("Invalid NIC format");
      }
      return;
    }

    // Phone Number Validation
    if (name === "phone_number") {
      setDriver({ ...driver, [name]: value });
      if (value === "" || validateContact(value)) {
        setContactError("");
      } else {
        setContactError("Invalid phone number format");
      }
      return;
    }

    // Age Validation
    if (name === "age") {
      setDriver({ ...driver, [name]: value });
      if (value === "" || validateAge(value)) {
        setAgeError("");
      } else {
        setAgeError("Driver must be 18 years or older");
      }
      return;
    }

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
        image: reader.result.split(",")[1],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    // Stop if validation fails
    if (nicError || contactError || ageError) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    if (!validateNIC(driver.nic)) {
      setError("Invalid NIC format.");
      return;
    }

    if (!validateContact(driver.phone_number)) {
      setError("Invalid phone number format.");
      return;
    }

    if (!validateAge(driver.age)) {
      setError("Driver must be at least 18 years old.");
      return;
    }

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

      onSuccess(response.data.data);

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
    } catch (error) {
      setError(error.response?.data?.message || "Network error");
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
    <div className="flex justify-center items-center w-100 min-h-screen bg-gray-100">
      <div className="bg-white p-15 rounded-lg shadow-lg w-full h-full max-w-md relative">

        {/* Top Left: Close */}
<div className="absolute top-3 left-3 z-10">
  <button
    onClick={onCancel}
    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
    title="Close"
  >
    <FaTimes size={16} />
  </button>
</div>

        <h2 className="text-xl font-semibold mb-6 text-center">Add New Driver</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Driver Name"
            value={driver.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300"
            required
          />

          {/* Phone Number */}
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number (e.g., 0712345678)"
            value={driver.phone_number}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              contactError ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {contactError && <p className="text-red-500 text-sm">{contactError}</p>}

          {/* Charges */}
          <input
            type="number"
            name="driver_charges"
            placeholder="Driver Charges (LKR)"
            value={driver.driver_charges}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300"
            required
          />

          {/* NIC */}
          <input
            type="text"
            name="nic"
            placeholder="NIC Number"
            value={driver.nic}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              nicError ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {nicError && <p className="text-red-500 text-sm">{nicError}</p>}

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={driver.age}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              ageError ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {ageError && <p className="text-red-500 text-sm">{ageError}</p>}

          {/* License Number */}
          <input
            type="text"
            name="license_number"
            placeholder="License Number"
            value={driver.license_number}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-gray-300"
            required
          />

          {/* License Expiry */}
          <div>
            <label className="text-sm text-gray-600">License Expiry Date</label>
            <input
              type="date"
              name="license_expiry_date"
              value={driver.license_expiry_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Driver Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* Confirm Wrapper */}
          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Confirm Adding Driver"
            confirmText="Yes, Add Driver"
            cancelText="No, Go Back"
            icon={<FiUserPlus />}
            buttonBackgroundColor="bg-blue-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Driver"}
            </button>
          </ConfirmWrapper>

          
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
