import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddAdminModal = ({ onClose, onAdminUpdated, editAdmin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Product Manager",
    status: "Active", // default status
  });

  useEffect(() => {
    if (editAdmin) {
      setFormData({
        name: editAdmin.name,
        email: editAdmin.email,
        password: "",
        role: editAdmin.role,
        status: editAdmin.status,
      });
    }
  }, [editAdmin]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent page reload
    try {
      if (editAdmin) {
        await axios.put(`http://localhost:5000/api/admins/${editAdmin._id}`, formData);
        toast.success("Admin updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/admins", formData);
        toast.success("Admin added successfully");
      }
  
      onAdminUpdated();   // refresh the list
      onClose();          // close modal
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {editAdmin ? "Edit Admin" : "Add New Admin"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={editAdmin}
            className="w-full border p-2 rounded"
          />
          {!editAdmin && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          )}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Super Admin</option>
            <option>Product Manager</option>
            <option>Order Manager</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editAdmin ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
