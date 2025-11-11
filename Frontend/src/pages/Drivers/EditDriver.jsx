import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ✅ Fetch existing driver details
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await api.get(`/api/drivers/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDriver(response.data.data);
      } catch (err) {
        console.error("Error fetching driver:", err);
        setError(err.response?.data?.message || "Failed to fetch driver details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  // ✅ Convert uploaded image to Base64
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setDriver({ ...driver, [name]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: driver.name,
        phone_number: driver.phone_number,
        driver_charges: parseFloat(driver.driver_charges),
        nic: driver.nic,
        age: parseInt(driver.age),
        license_number: driver.license_number,
        license_expiry_date: driver.license_expiry_date,
        image: driver.image,
      };

      await api.put(`/api/drivers/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage("✅ Driver updated successfully!");
      setTimeout(() => navigate("/driver-management"), 2000);
    } catch (err) {
      console.error("Error updating driver:", err);
      setError(err.response?.data?.message || "Failed to update driver.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!driver) return <div className="text-center py-10 text-red-600">Driver not found</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-teal-700">
          Edit Driver Details
        </h2>

        {/* ✅ Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={driver.name || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* NIC */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">NIC</label>
            <input
              type="text"
              name="nic"
              value={driver.nic || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={driver.phone_number || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Driver Charges */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Driver Charges (LKR)</label>
            <input
              type="number"
              name="driver_charges"
              value={driver.driver_charges || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={driver.age || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">License Number</label>
            <input
              type="text"
              name="license_number"
              value={driver.license_number || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* License Expiry Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">License Expiry Date</label>
            <input
              type="date"
              name="license_expiry_date"
              value={driver.license_expiry_date?.split("T")[0] || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Driver Photo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Driver Photo</label>
            {driver.image && (
              <img
                src={driver.image}
                alt="Driver"
                className="w-40 h-40 object-cover border rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/driver-management")}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
