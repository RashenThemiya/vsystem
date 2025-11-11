import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const AddOwner = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState({
    owner_name: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { name, role } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        setOwner({
          owner_name: "",
          contact_number: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
          navigate("/vehicle-owner");
        }, 2000);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
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

          <ConfirmWrapper
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message="Confirm Adding Vehicle Owner"
            additionalInfo="Please verify the details before submission."
            confirmText="Yes, Add Owner"
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
              {loading ? "Adding..." : "Add Owner"}
            </button>
          </ConfirmWrapper>

          <button
            type="button"
            onClick={() => navigate("/vehicle-owner")}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOwner;
