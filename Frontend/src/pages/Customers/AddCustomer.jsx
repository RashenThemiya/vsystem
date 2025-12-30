import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import { FaTimes, FaCheck } from "react-icons/fa";


const AddCustomer = ({ onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    nic: "",
    nic_photo_front: "",
    nic_photo_back: "",
    phone_number: "",
    email: "",
    profile_photo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [AddCustomerMode, setAddCustomerMode] = useState(false);
  const [nicError, setNicError] = useState("");
  const [contactError, setContactError] = useState("");
  const { name: loggedUser, role } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nic") {
    if (value === "" || validateNIC(value)) {
      setCustomer({ ...customer, [name]: value });
      setNicError(""); 
    } else {
      setCustomer({ ...customer, [name]: value });
      setNicError("Invalid NIC format");
    }
    return;
  }
  if (name === "phone_number") {
    if (value === "" || validateContact(value)) {
      setCustomer({ ...customer, [name]: value });
      setContactError(""); 
    } else {
      setCustomer({ ...customer, [name]: value });
      setContactError("Invalid Phone Number format");
    }
    return;
  }
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
        ...customer,
        nic_photo_front: customer.nic_photo_front ? `data:image/png;base64,${customer.nic_photo_front}` : null,
        nic_photo_back: customer.nic_photo_back ? `data:image/png;base64,${customer.nic_photo_back}` : null,
        profile_photo: customer.profile_photo ? `data:image/png;base64,${customer.profile_photo}` : null,

      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/customers`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (onSuccess) {
                onSuccess(response.data.data); // Pass the newly created customer data (if the API returns it)
            }
        setShowSuccess(true);
        setCustomer({
          name: "",
          nic: "",
          nic_photo_front: "",
          nic_photo_back: "",
          phone_number: "",
          email: "",
          profile_photo: "",
        });
       

        setTimeout(() => {
          setShowSuccess(false);
          if (onCancel) {
                    onCancel(); 
                } else {
                    navigate("/customer-dashboard");
                }
                
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
    if (onCancel) onCancel(); // <-- call parent handler
  };

  const validateNIC = (nic) => {
  const oldNIC = /^[0-9]{9}[vVxX]$/;   // 9 numbers + V/X
  const newNIC = /^[0-9]{12}$/;        // 12 numbers

  return oldNIC.test(nic) || newNIC.test(nic);
  };
  const validateContact = (contact_number) => {
    const contact = /^0[0-9]{9}$/;   // 10 numbers

    return contact.test(contact_number);
  };


  
  return (
    
    <div className="flex justify-center items-center w-100 min-h-screen bg-grey-100">
      <div className="bg-white p-15 rounded-lg shadow-lg w-full h-full max-w-md relative">
        {/* Top Left: Close */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={handleCancel}
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
              className="p-2 rounded-full bg-green-200 hover:bg-green-300 text-green-700 shadow"
              disabled={loading}
            >
               <FaCheck size={18} />
            </button>
          </ConfirmWrapper>
      </div>

        <h2 className="text-xl font-semibold mb-6 text-center">
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
              className={`w-full p-2 border rounded-lg border-gray-300`}
              required
            />
          {/* NIC Front Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              name="profile_photo"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>
    
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
            placeholder="Phone Number (e.g., 07XXXXXXXX)"
            value={customer.phone_number}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
                contactError ? "border-red-500" : "border-gray-300"
              }`}
            required
          />
           {contactError && (
              <p className="text-red-500 text-sm mt-1">{contactError}</p>
            )}


          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          

          {/*<button
            type="button"
            onClick={handleCancel}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>*/}
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
