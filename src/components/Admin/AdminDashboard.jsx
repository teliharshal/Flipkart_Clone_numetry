import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../actions/userAction"; // Use correct function name
// Ensure you have a logout action

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Logout Handler
  const handleLogout = () => {
    dispatch(logoutUser()); // Use logoutUser instead of logout
    localStorage.removeItem("adminToken"); // Clear admin token if stored
    navigate("/admin-login"); // Redirect to admin login page
  };
  

  return (
    <main className="flex-1 p-8 bg-gray-100 min-h-screen mt-[65px]">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome Back, Admin! 🚀</p>
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
          <h2 className="text-2xl font-bold text-gray-800">📦 250</h2>
          <p className="text-gray-600">Total Products</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">🛒 120</h2>
          <p className="text-gray-600">Orders Pending</p>
        </div>
        <div className="bg-white p-5 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">✅ 98</h2>
          <p className="text-gray-600">Orders Delivered</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </main>
  );
};

export default AdminDashboard;
