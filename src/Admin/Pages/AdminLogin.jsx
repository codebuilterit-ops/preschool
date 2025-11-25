import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/adminapi";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await loginAdmin(email, password);
        const token = res.data?.token;
        if (token) {
          localStorage.setItem("admin_token", token);
          // navigate to dashboard
          navigate("/admin/dashboard");
        } else {
          alert("Login failed");
        }
      } catch (err) {
        console.error("Admin login error", err);
        alert(err.response?.data?.message || "Login failed");
      }
    })();
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Sign In as Admin
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Forgot password?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
