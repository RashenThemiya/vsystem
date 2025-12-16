import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed
import { FaTimes, FaCheck } from "react-icons/fa";


const AddOwner = ({ onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState({
    owner_name: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const { name, role } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Phone Validation (10 digits, starts with 0)
  if (name === "contact_number") {
    const phonePattern = /^0\d{9}$/;

    if (!phonePattern.test(value)) {
      setPhoneError("Phone must start with 0 and contain exactly 10 digits.");
    } else {
      setPhoneError("");
    }
  }
    setOwner({ ...owner, [name]: value });
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
        `${import.meta.env.VITE_API_BASE_URL}/api/owners`,
        owner,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        onSuccess(response.data.data);
        setOwner({
          owner_name: "",
          contact_number: "",
        });

      }
    } catch (error) {
      console.error("Error adding owner:", error);
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
    <div className="flex justify-center items-center w-100 min-h-screen bg-white-100">
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
        <div className="absolute top-4 right-4">
        <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Confirm Adding Vehicle Owner"
            additionalInfo="Please verify the details before submission."
            confirmText="Yes, Add Owner"
            cancelText="No, Go Back"
            icon={<FiUserPlus />}
            buttonBackgroundColor="bg-green-600"
            buttonTextColor="text-white"
          >
            <button
              type="submit"
              className="p-2 rounded-full bg-green-200 hover:bg-green-300 text-green-700 shadow"
              disabled={loading}
            >
              <FaCheck size={18} />
            </button>
          </ConfirmWrapper>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Add New Vehicle Owner
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            ✅ Vehicle owner added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="owner_name"
            placeholder="Owner Name"
            value={owner.owner_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number (e.g., 0771234567)"
            value={owner.contact_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}

          

         {/* <button
            type="button"
             onClick={onCancel}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>*/}
        </form>
      </div>
    </div>
  );
};

export default AddOwner;
