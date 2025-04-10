import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/admin/users", newUser);
      setNewUser({ name: "", email: "", role: "user" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditUser(user);
  };

  // Save edited user
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, editUser);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

      {/* Add User Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New User</h3>
        <input type="text" placeholder="Name" className="border p-2 w-full mb-2"
          value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2"
          value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <select className="border p-2 w-full mb-2"
          value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2 w-full" onClick={handleAddUser}>
          Add User
        </button>
      </div>

      {/* User List */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-600">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit User Form */}
      {editUser && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-xl font-semibold mb-4">Edit User</h3>
          <input type="text" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            className="border p-2 w-full mb-2" placeholder="Name" />
          <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            className="border p-2 w-full mb-2" placeholder="Email" />
          <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            className="border p-2 w-full mb-2">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 mr-2" onClick={handleSave}>Save</button>
          <button className="bg-gray-400 text-white px-4 py-2" onClick={() => setEditUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
