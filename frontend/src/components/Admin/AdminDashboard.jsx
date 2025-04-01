import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 120,
    pendingOrders: 25,
    deliveredOrders: 80,
    totalRevenue: 50000,
    totalProducts: 15,
  });

  const [orderStats, setOrderStats] = useState([
    { month: "Jan", orders: 30 },
    { month: "Feb", orders: 40 },
    { month: "Mar", orders: 50 },
    { month: "Apr", orders: 35 },
    { month: "May", orders: 60 },
  ]);

  const [salesComparison, setSalesComparison] = useState([
    { month: "Jan", sales: 5000, returns: 500 },
    { month: "Feb", sales: 7000, returns: 800 },
    { month: "Mar", sales: 6000, returns: 700 },
    { month: "Apr", sales: 7500, returns: 600 },
    { month: "May", sales: 9000, returns: 1000 },
  ]);

  const [categorySales, setCategorySales] = useState([
    { name: "Electronics", sales: 40 },
    { name: "Clothing", sales: 25 },
    { name: "Home Decor", sales: 15 },
    { name: "Sports", sales: 20 },
  ]);

  return (
    <main className="flex-1 p-8 bg-gray-100 min-h-screen mt-[65px]">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome to Admin Panel 🚀</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: "👤" },
          { label: "Orders Pending", value: stats.pendingOrders, icon: "🛒" },
          { label: "Orders Delivered", value: stats.deliveredOrders, icon: "✅" },
          { label: "Total Revenue", value: `$${stats.totalRevenue}`, icon: "💰" },
          { label: "Total Products", value: stats.totalProducts, icon: "📦" },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-5 shadow-md rounded-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800">{stat.icon} {stat.value}</h2>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          { name: "Manage Products", link: "/admin/products", emoji: "📦" },
          { name: "Manage Orders", link: "/admin/orders", emoji: "🛒" },
          { name: "Manage Users", link: "/admin/users", emoji: "👤" },
        ].map((section, index) => (
          <a
            key={index}
            href={section.link}
            className="bg-white p-6 shadow-md rounded-lg text-center text-xl font-semibold hover:shadow-lg transition"
          >
            {section.emoji} {section.name}
          </a>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Bar Chart: Monthly Orders */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Monthly Orders</h3>
          <div className="h-[200px]">
            <Bar
              data={{
                labels: orderStats.map((stat) => stat.month),
                datasets: [{ 
                  label: "Orders", 
                  data: orderStats.map((stat) => stat.orders), 
                  backgroundColor: "rgba(75, 192, 192, 0.6)" 
                }],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Line Chart: Sales vs Returns */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Sales vs. Returns</h3>
          <div className="h-[200px]">
            <Line
              data={{
                labels: salesComparison.map((data) => data.month),
                datasets: [
                  { label: "Sales", data: salesComparison.map((data) => data.sales), borderColor: "blue", tension: 0.4 },
                  { label: "Returns", data: salesComparison.map((data) => data.returns), borderColor: "red", tension: 0.4 },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Pie Chart: Category-wise Sales */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Category-wise Sales</h3>
          <div className="h-[200px]">
            <Pie
              data={{
                labels: categorySales.map((category) => category.name),
                datasets: [{ data: categorySales.map((category) => category.sales), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"] }],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
