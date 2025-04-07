import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ customer: "", status: "Pending", total: "" });
  const [editingOrder, setEditingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleAddOrder = async () => {
    if (newOrder.customer && newOrder.total) {
      try {
        const res = await axios.post(API_URL, newOrder);
        setOrders([res.data, ...orders]);
        setNewOrder({ customer: "", status: "Pending", total: "" });
      } catch (err) {
        console.error("Error adding order:", err);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  const handleUpdateOrder = async () => {
    try {
      const res = await axios.put(`${API_URL}/${editingOrder._id}`, editingOrder);
      setOrders(orders.map((order) => (order._id === editingOrder._id ? res.data : order)));
      setEditingOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const handleQuickStatusChange = async (id, status) => {
    try {
      const updated = await axios.put(`${API_URL}/${id}`, { status });
      setOrders(orders.map((order) => (order._id === id ? updated.data : order)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredOrders = filterStatus === "All"
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="p-8 bg-gray-100 min-h-screen mt-[65px]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>

      {/* Order Form */}
      <div className="bg-white p-5 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingOrder ? "Edit Order" : "Add New Order"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="customer"
            placeholder="Customer Name"
            value={editingOrder ? editingOrder.customer : newOrder.customer}
            onChange={(e) =>
              editingOrder
                ? setEditingOrder({ ...editingOrder, customer: e.target.value })
                : handleChange(e)
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="total"
            placeholder="Total Amount"
            value={editingOrder ? editingOrder.total : newOrder.total}
            onChange={(e) =>
              editingOrder
                ? setEditingOrder({ ...editingOrder, total: e.target.value })
                : handleChange(e)
            }
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={editingOrder ? editingOrder.status : newOrder.status}
            onChange={(e) =>
              editingOrder
                ? setEditingOrder({ ...editingOrder, status: e.target.value })
                : handleChange(e)
            }
            className="border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button
          className={`mt-4 px-5 py-2 text-white rounded ${editingOrder ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={editingOrder ? handleUpdateOrder : handleAddOrder}
        >
          {editingOrder ? "Update Order" : "Add Order"}
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-5 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Orders List</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Customer</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-center border">
                <td className="border p-2">{order.customer}</td>
                <td className="border p-2">{order.total}</td>
                <td className="border p-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border p-2 flex items-center justify-center gap-2">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline">
                    View
                  </button>
                  <button onClick={() => handleEditOrder(order)} className="text-yellow-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteOrder(order._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No orders found for selected status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p><strong>ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Total:</strong> {selectedOrder.total}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
