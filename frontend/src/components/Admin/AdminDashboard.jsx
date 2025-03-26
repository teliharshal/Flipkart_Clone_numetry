import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../actions/userAction"; // Ensure correct import

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [admin, setAdmin] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);

  // Fetch Admin Details & Stats
  // useEffect(() => {
  //   fetchAdminDetails();
  //   fetchDashboardStats();
  // }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/admin/me", { withCredentials: true });
      if (response.data.role !== "admin") {
        navigate("/"); // Redirect non-admins to home
      } else {
        setAdmin(response.data);
      }
    } catch (error) {
      navigate("/admin-login"); // Redirect if not authenticated
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const userRes = await axios.get("http://localhost:5000/api/v1/users/count");
      const pendingOrdersRes = await axios.get("http://localhost:5000/api/v1/orders/pending");
      const deliveredOrdersRes = await axios.get("http://localhost:5000/api/v1/orders/delivered");

      setTotalUsers(userRes.data.count);
      setPendingOrders(pendingOrdersRes.data.count);
      setDeliveredOrders(deliveredOrdersRes.data.count);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <main className="flex-1 p-8 bg-gray-100 min-h-screen mt-[65px]">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome Back, {admin?.name}! 🚀</p>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">👤 {totalUsers}</h2>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">🛒 {pendingOrders}</h2>
          <p className="text-gray-600">Orders Pending</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">✅ {deliveredOrders}</h2>
          <p className="text-gray-600">Orders Delivered</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-lg shadow-md cursor-pointer text-center transition duration-300"
          onClick={() => navigate("/admin/products")}
        >
          <h3 className="text-xl font-semibold">Manage Products</h3>
          <p className="text-gray-200 mt-1">Add, Update, or Delete Products</p>
        </div>
        <div
          className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-lg shadow-md cursor-pointer text-center transition duration-300"
          onClick={() => navigate("/admin/orders")}
        >
          <h3 className="text-xl font-semibold">Manage Orders</h3>
          <p className="text-gray-200 mt-1">View and Process Orders</p>
        </div>
        <div
          className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-lg shadow-md cursor-pointer text-center transition duration-300"
          onClick={() => navigate("/admin/users")}
        >
          <h3 className="text-xl font-semibold">Manage Users</h3>
          <p className="text-gray-200 mt-1">View, Delete, or Update Users</p>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
