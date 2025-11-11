import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ✅ Fetch existing customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCustomer(response.data.data);
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(
          err.response?.data?.message || "Failed to fetch customer details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  // ✅ Convert uploaded image to base64
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomer({ ...customer, [name]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle submit (update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: customer.name,
        nic: customer.nic,
        phone_number: customer.phone_number,
        email: customer.email,
        nic_photo_front: customer.nic_photo_front,
        nic_photo_back: customer.nic_photo_back,
      };

      await api.put(`/api/customers/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage("✅ Customer updated successfully!");
      setTimeout(() => navigate("/view-customers"), 2000);
    } catch (err) {
      console.error("Error updating customer:", err);
      setError(err.response?.data?.message || "Failed to update customer.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!customer)
    return <div className="text-center py-10 text-red-600">Customer not found</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-teal-700">
          Edit Customer Details
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
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={customer.name || ""}
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
              value={customer.nic || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={customer.phone_number || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={customer.email || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* NIC Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                NIC Front Photo
              </label>
              {customer.nic_photo_front && (
                <img
                  src={customer.nic_photo_front}
                  alt="NIC Front"
                  className="w-40 h-28 object-cover border rounded-lg mb-2"
                />
              )}
              <input
                type="file"
                name="nic_photo_front"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                NIC Back Photo
              </label>
              {customer.nic_photo_back && (
                <img
                  src={customer.nic_photo_back}
                  alt="NIC Back"
                  className="w-40 h-28 object-cover border rounded-lg mb-2"
                />
              )}
              <input
                type="file"
                name="nic_photo_back"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/view-customers")}
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

export default EditCustomer;
