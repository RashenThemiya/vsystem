import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

// Pixel-perfect single-file React + Tailwind component that mirrors the supplied screenshot.
// Notes:
// - Place the uploaded image at the path used below (we reference the provided local path).
// - This component uses Tailwind CSS classes. Make sure Tailwind is configured in your project.
// - Small additional styles are included via a <style> tag for the diagonal white wedge and exact shadows.

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

  // IMPORTANT: the image path below points to the uploaded file available in the environment.
  const leftImage = "/images/footer.png";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6e9f0] pr-20 pt-10">
      {/* custom styles for diagonal wedge, rounded inner card shadow, and subtle overlays */}
      <style>{`
        .inner-card {
          border-radius: 14px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.25);
        }
        .soft-rounded-left {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .soft-rounded-right {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        /* thin underline inputs like the design */
        .underline-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.35);
          padding: 8px 6px;
          outline: none;
        }
        .underline-input::placeholder { color: rgba(255,255,255,0.5); }
        /* social circular icons */
        .social-circle { width:36px; height:36px; border-radius:9999px; display:inline-flex; align-items:center; justify-content:center; background:white; }
      `}</style>

      <div className="relative w-200 max-w-6xl inner-card overflow-hidden bg-white flex" style={{ borderRadius: 18 }}>
      

     
        {/* LEFT: Image panel */}
        <div
          className="hidden md:flex relative w-[25rem] rounded-l-2xl overflow-hidden items-center justify-center bg-gray-100"
          style={{ minHeight: "580px" }}
        >
          <img
          src={leftImage}
          alt="hero"
          className="object-contain"
          style={{ width: "80%", maxWidth: "100%", height: "80%" }}
        />

        </div>



        {/* RIGHT: Form panel */}
        <div className="w-full md:w-110 bg-gradient-to-r from-indigo-700 to-violet-700 text-white p-6 soft-rounded-right flex flex-col justify-center relative" style={{ minHeight: 500 }}>
          <div className="max-w-md mx-auto w-full ">
            <div className="flex justify-center mb-6">
              <div style={{ borderLeft: '4px solid rgba(255,255,255,0.85)', paddingLeft: 12 }}>
              
                <h2 className="text-2xl md:text-2xl font-serif font-semibold tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Login Portal</h2>
              </div>
            </div>

            {error && <p className="text-red-300 text-center mb-3">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <div className="flex items-center">
                  <input
                    className="underline-input w-full text-white placeholder-gray-300"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="ml-3 opacity-70"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/><path d="M7 10l5 5 5-5"/></svg></div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Password</label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="underline-input w-full text-white placeholder-gray-300"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-3 opacity-80">
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.52 0-10.21-3.58-11.8-8 1.07-2.9 3.06-5.2 5.44-6.6"/><path d="M1 1l22 22"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-white text-[#264c7f] font-semibold py-3 rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
