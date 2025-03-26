import React, { useState } from "react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", status: "Pending", total: "$120" },
    { id: 2, customer: "Jane Smith", status: "Shipped", total: "$200" },
  ]);
  const [newOrder, setNewOrder] = useState({ customer: "", status: "Pending", total: "" });
  const [editingOrder, setEditingOrder] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  // Add New Order
  const handleAddOrder = () => {
    if (newOrder.customer && newOrder.total) {
      setOrders([...orders, { id: orders.length + 1, ...newOrder }]);
      setNewOrder({ customer: "", status: "Pending", total: "" });
    } else {
      alert("Please fill all fields");
    }
  };

  // Edit Order
  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  // Update Order
  const handleUpdateOrder = () => {
    setOrders(orders.map((order) => (order.id === editingOrder.id ? editingOrder : order)));
    setEditingOrder(null);
  };

  // Delete Order
  const handleDeleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

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
            onChange={(e) => (editingOrder ? setEditingOrder({ ...editingOrder, customer: e.target.value }) : handleChange(e))}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="total"
            placeholder="Total Amount"
            value={editingOrder ? editingOrder.total : newOrder.total}
            onChange={(e) => (editingOrder ? setEditingOrder({ ...editingOrder, total: e.target.value }) : handleChange(e))}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={editingOrder ? editingOrder.status : newOrder.status}
            onChange={(e) => (editingOrder ? setEditingOrder({ ...editingOrder, status: e.target.value }) : handleChange(e))}
            className="border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <button
          className={`mt-4 px-5 py-2 text-white rounded ${
            editingOrder ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={editingOrder ? handleUpdateOrder : handleAddOrder}
        >
          {editingOrder ? "Update Order" : "Add Order"}
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-5 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Orders List</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center border">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.customer}</td>
                <td className="border p-2">{order.total}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  <button onClick={() => handleEditOrder(order)} className="text-yellow-600 mr-2 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
