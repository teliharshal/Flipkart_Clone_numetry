import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; // Import icons from Heroicons

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingUserId) {
                response = await axios.put(`http://localhost:5000/api/users/${editingUserId}`, formData);
            } else {
                response = await axios.post("http://localhost:5000/api/users", formData);
            }
    
            // Update the users list without fetching again
            const newUser = { id: response.data.id, ...formData };
            setUsers(editingUserId ? users.map(user => (user.id === editingUserId ? newUser : user)) : [...users, newUser]);
    
            setFormData({ name: "", email: "", role: "user" });
            setEditingUserId(null);
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = (user) => {
        setFormData({ name: user.name, email: user.email, role: user.role });
        setEditingUserId(user.id);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-[80px]">   
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">User Management</h2>

            {/* Add / Edit User Form */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {editingUserId ? "Update User" : "Add User"}
                </button>
            </form>

            {/* User List Table */}
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3 flex justify-center gap-4">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-5 w-5" />
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

export default ManageUsers;
