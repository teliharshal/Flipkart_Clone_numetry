import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAdminModal from "./AddAdminModal";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admins");
      setAdmins(res.data);
    } catch (error) {
      toast.error("Failed to fetch admins");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await axios.put(`http://localhost:5000/api/admins/${id}`, { status: updatedStatus });
      toast.success("Status updated!");
      fetchAdmins();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      console.log("Deleting admin with ID:", id); // Debug log
      await axios.delete(`http://localhost:5000/api/admins/${id}`);
      toast.success("Admin deleted successfully");
      fetchAdmins(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err); // Log actual error
      toast.error("Failed to delete admin");
    }
  };
  

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setShowModal(true);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditAdmin(null);
            setShowModal(true);
          }}
        >
          Add New Admin
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id} className="text-center">
              <td className="p-2 border">{admin.name}</td>
              <td className="p-2 border">{admin.email}</td>
              <td className="p-2 border">
                {admin.role}
                {admin.role === "Super Admin" && (
                  <span className="ml-2 text-xs text-white bg-red-500 px-2 py-1 rounded-full">Super</span>
                )}
              </td>
              <td className="p-2 border">{admin.status}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="text-blue-600"
                  title="Edit Role"
                  onClick={() => handleEdit(admin)}
                >
                  ✏️
                </button>
                <button
                  className="text-yellow-600"
                  title={admin.status === "Active" ? "Deactivate" : "Activate"}
                  onClick={() => handleStatusToggle(admin._id, admin.status)}
                >
                  🔁
                </button>
                <button
                  className="text-red-600"
                  title="Delete"
                  onClick={() => handleDelete(admin._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddAdminModal
          onClose={() => setShowModal(false)}
          onAdminUpdated={fetchAdmins}
          editAdmin={editAdmin}
        />
      )}
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageAdmins;
