import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/admin/register", formData);
            setSuccess(res.data.message);
            setError("");
            setTimeout(() => navigate("/admin-login"), 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Try again.");
            setSuccess("");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Admin Register</h2>
                {error && <p className="text-red-600 text-center">{error}</p>}
                {success && <p className="text-green-600 text-center">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
