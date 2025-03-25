import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Add a new order
  const addOrder = () => {
    const customerName = prompt("Enter Customer Name:");
    if (!customerName) return;
    
    const newOrder = {
      id: Date.now(), // Unique ID
      customer: customerName,
      status: "Processing",
    };

    setOrders([...orders, newOrder]);
  };

  // Edit order status
  const toggleStatus = (id) => {
    setOrders(
      orders.map(order =>
        order.id === id
          ? { ...order, status: order.status === "Processing" ? "Shipped" : "Processing" }
          : order
      )
    );
  };

  // Delete an order
  const deleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/products" className="block p-2 hover:bg-gray-700 rounded">Manage Products</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">
        <h1 className="text-2xl font-semibold mb-5">Manage Orders</h1>
        <button
          onClick={addOrder}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Order
        </button>
        
        <div className="bg-white p-5 rounded shadow">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border p-2">#{order.id}</td>
                    <td className="border p-2">{order.customer}</td>
                    <td className={`border p-2 ${order.status === "Shipped" ? "text-green-500" : "text-yellow-500"}`}>
                      {order.status}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => toggleStatus(order.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center text-gray-500">No Orders Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
