import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa"; // ← icon for back button

export default function PixelPerfectLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", { email, password });
      const { token, admin } = res.data;
      setAuthData(token, admin.role, admin.email);
      if (admin.role === "Admin" || admin.role === "SuperAdmin") navigate("/admin-dashboard");
      else if (admin.role === "Driver") navigate("/driver-dashboard");
      else if (admin.role === "Customer") navigate(`/customer-profileDashboard/${admin.customer_id}`);
      else setError("Unknown role, cannot redirect.");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const leftImage = "/images/logo.jpg";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6e9f0] p-4 md:p-10">
      <style>{`
        .inner-card {
          border-radius: 14px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.25);
        }
        .underline-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.35);
          padding: 8px 6px;
          outline: none;
        }
        .underline-input::placeholder { color: rgba(255,255,255,0.5); }
      `}</style>

      <div className="relative w-full max-w-3xl inner-card overflow-hidden bg-white flex flex-col md:flex-row">

        {/* 🔹 MOBILE LOGO */}
        <div className="md:hidden flex justify-center items-center py-6 bg-white">
          <img src={leftImage} alt="Logo" className="h-20 object-contain" />
        </div>

        {/* 🔹 DESKTOP LEFT IMAGE */}
        <div className="hidden md:flex w-[25rem] bg-white items-center justify-center">
          <img src={leftImage} alt="hero" className="object-contain h-[90%]" />
        </div>

        {/* 🔹 RIGHT / FORM PANEL */}
        <div className="w-115 bg-gradient-to-r from-indigo-700 to-violet-700 text-white p-6 md:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">

            {/* ← Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white mb-7  hover:text-gray-200 font-semibold"
            >
              <FaArrowLeft className="mr-2 top-0 left-0 " /> 
            </button>

            <div className="flex justify-center mb-6">
              <div className="border-l-4 border-white/80 pl-3">
                <h2 className="text-2xl font-serif font-semibold tracking-wider">
                  Login Portal
                </h2>
              </div>
            </div>

            {error && <p className="text-red-300 text-center mb-3">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  className="underline-input w-full text-white"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-2">Password</label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="underline-input w-full text-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 opacity-80"
                  >

                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-indigo-700 font-semibold py-3 rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
