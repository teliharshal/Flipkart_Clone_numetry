import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../actions/userAction";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  const [orderStats, setOrderStats] = useState([]);

  // useEffect(() => {
  //   const token = localStorage.getItem("adminToken");
  //   if (!token) {
  //     navigate("/admin-login"); // Redirect if no token found
  //   } else {
  //     fetchAdminDetails();
  //     fetchDashboardStats();
  //     fetchOrderStats();
  //   }
  // }, []);

  

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/admin/me", {
        withCredentials: true,
      });
      if (response.data.role !== "admin") {
        navigate("/");
      } else {
        setAdmin(response.data);
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
      navigate("/admin-login");
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [userRes, pendingOrdersRes, deliveredOrdersRes, revenueRes, productsRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/v1/users/count"),
          axios.get("http://localhost:5000/api/v1/orders/pending"),
          axios.get("http://localhost:5000/api/v1/orders/delivered"),
          axios.get("http://localhost:5000/api/v1/orders/revenue"),
          axios.get("http://localhost:5000/api/v1/products/count"),
        ]);

      setStats({
        totalUsers: userRes.data.count || 0,
        pendingOrders: pendingOrdersRes.data.count || 0,
        deliveredOrders: deliveredOrdersRes.data.count || 0,
        totalRevenue: revenueRes.data.total || 0,
        totalProducts: productsRes.data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/admin/order-stats");
      setOrderStats(response.data);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // Chart.js Data
  const chartData = {
    labels: orderStats.map((stat) => stat.month),
    datasets: [
      {
        label: "Orders per Month",
        data: orderStats.map((stat) => stat.orders),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="flex-1 p-8 bg-gray-100 min-h-screen mt-[65px]">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome Back, {admin?.name}! 🚀</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">👤 {stats.totalUsers}</h2>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">🛒 {stats.pendingOrders}</h2>
          <p className="text-gray-600">Orders Pending</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">✅ {stats.deliveredOrders}</h2>
          <p className="text-gray-600">Orders Delivered</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">💰 ${stats.totalRevenue}</h2>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">📦 {stats.totalProducts}</h2>
          <p className="text-gray-600">Total Products</p>
        </div>
      </div>

      {/* Order Statistics Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold mb-4">Order Statistics</h3>
        <div className="w-full h-[350px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Monthly Orders", font: { size: 16 } },
              },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { drawBorder: false } },
              },
            }}
          />
        </div>
      </div>

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
    <p className="text-gray-200 mt-1">View, Edit, or Delete Users</p>
  </div>
</div>
    </main>
  );
};

export default AdminDashboard;
