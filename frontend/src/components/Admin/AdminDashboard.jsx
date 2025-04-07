import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

  // New: Sales Trend Data (Daily, Weekly, Monthly)
  const [salesTrend, setSalesTrend] = useState([
    { day: "Monday", sales: 2000 },
    { day: "Tuesday", sales: 3000 },
    { day: "Wednesday", sales: 2500 },
    { day: "Thursday", sales: 4000 },
    { day: "Friday", sales: 3500 },
  ]);

  // New: Top-Selling & Least-Performing Products
  const [topSelling, setTopSelling] = useState([
    { name: "Laptop", sales: 150 },
    { name: "Smartphone", sales: 130 },
    { name: "Headphones", sales: 110 },
  ]);

  const [leastPerforming, setLeastPerforming] = useState([
    { name: "Smartwatch", sales: 15 },
    { name: "Tablet", sales: 10 },
    { name: "VR Headset", sales: 5 },
  ]);


  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["Processing", "Shipped", "Delivered"];
      const newOrder = {
        id: Math.floor(Math.random() * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
  
      setLiveOrderStatus((prev) => [newOrder, ...prev.slice(0, 4)]);
  
      // Toast for new order
      toast.info(`New order #${newOrder.id} - ${newOrder.status}`);
    }, 60000); // every 5 seconds
  
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    const checkStock = () => {
      const lowStockProducts = [
        { name: "Mouse", stock: 3 },
        { name: "Keyboard", stock: 2 },
      ];
  
      lowStockProducts.forEach((product) => {
        if (product.stock < 5) {
          toast.warn(`${product.name} stock is low (${product.stock} left)!`);
        }
      });
    };
  
    const interval = setInterval(checkStock, 10000); // every 10s
  
    return () => clearInterval(interval);
  }, []);
  



  // New: Simulated WebSocket Order Status Updates
  const [liveOrderStatus, setLiveOrderStatus] = useState([]);


  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["Processing", "Shipped", "Delivered"];
      const newOrder = {
        id: Math.floor(Math.random() * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
  
      setLiveOrderStatus((prev) => [newOrder, ...prev.slice(0, 4)]);
  
      // ✅ Show toast inside the same scope
      if (newOrder.status === "Delivered") {
        toast.success(`Order #${newOrder.id} has been delivered 🎉`);
      } else {
        toast.info(`New order #${newOrder.id} - ${newOrder.status}`);
      }
  
    }, 7000); // interval every 5s
  
    return () => clearInterval(interval);
  }, []);
  


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
            <h2 className="text-2xl font-bold text-gray-800">
              {stat.icon} {stat.value}
            </h2>
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

      {/* Charts Section 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    {/* Line Chart: Sales Trend */}
    <div className="bg-white p-4 rounded-lg shadow-md h-52">
    <h3 className="text-xl font-semibold mb-2">Sales Trend</h3>
    <div className="h-[180px]">
      <Line
        data={{
          labels: salesTrend.map((data) => data.day),
          datasets: [
            {
              label: "Sales",
              data: salesTrend.map((data) => data.sales),
              borderColor: "green",
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
        height={200}
      />
    </div>
  </div>

  {/* Top-Selling Products */}
  <div className="bg-white p-4 rounded-lg shadow-md h-52 overflow-y-auto max-h-48">
    <h3 className="text-xl font-semibold mb-2">Top-Selling Products</h3>
    <ul>
      {topSelling.map((item, index) => (
        <li key={index} className="mb-1">
          {item.name}: {item.sales} units
        </li>
      ))}
    </ul>
  </div>

  {/* Least-Performing Products */}
  <div className="bg-white p-4 rounded-lg shadow-md h-52 overflow-y-auto max-h-48">
    <h3 className="text-xl font-semibold mb-2">Least-Performing Products</h3>
    <ul>
      {leastPerforming.map((item, index) => (
        <li key={index} className="mb-1">
          {item.name}: {item.sales} units
        </li>
      ))}
    </ul>
  </div>
</div>

{/* Real-Time Order Status Updates */}
<div className="bg-white p-4 rounded-lg shadow-md mt-8 max-h-48 overflow-y-auto">
  <h3 className="text-xl font-semibold mb-2">Live Order Updates</h3>
  {liveOrderStatus.map((order, index) => (
    <p key={index} className="text-gray-700">
      Order #{order.id} - {order.status}
    </p>
  ))}
</div>

   <ToastContainer position="top-right" autoClose={3000} />

    </main>
  );
};

export default AdminDashboard;
