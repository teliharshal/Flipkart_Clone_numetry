import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/admin/auth", {
          withCredentials: true, // Ensures cookies are sent
        });

        if (res.data.isAuthenticated) {
          navigate("/admin/dashboard"); // Redirect if already logged in
        } else {
          navigate("/admin/register"); // Redirect to registration page
        }
      } catch (err) {
        console.log("Admin not authenticated", err);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/admin/login", {
        email,
        password,
      }, { withCredentials: true });

      navigate("/admin/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
