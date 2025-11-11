import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🟢 Attempting login...");
    console.log("Email:", email);
    console.log("Password:", password); // ⚠️ Be careful — remove this in production

    try {
      const res = await api.post("/api/admin/login", { email, password });
      console.log("✅ API Response:", res);

      const { token, admin } = res.data;
      console.log("Token:", token);
      console.log("Admin Data:", admin);

      // Save to context and localStorage
      setAuthData(token, admin.role, admin.email);

      // Redirect based on role
      if (admin.role === "Admin" || admin.role === "SuperAdmin") {
        console.log("➡️ Redirecting to Admin Dashboard");
        navigate("/admin-dashboard");
      } else if (admin.role === "Driver") {
        console.log("➡️ Redirecting to Driver Dashboard");
        navigate("/driver-dashboard");
      } else if (admin.role === "Customer") {
        console.log("➡️ Redirecting to Customer Dashboard");
        navigate("/customer-dashboard");
      } else {
        console.log("⚠️ Unknown role:", admin.role);
        setError("Unknown role, cannot redirect.");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      console.error("❌ Error response:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      console.log("🟡 Login attempt completed.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-emerald-200 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
