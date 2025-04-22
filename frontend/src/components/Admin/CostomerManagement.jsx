import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
  name: '',
  email: '',
  phone: '',
  status: 'Active',
});


const handleAddCustomer = async () => {
  try {
    await axios.post('http://localhost:5000/api/customers', newCustomer);
    toast.success('Customer added successfully');
    fetchCustomers();
    setShowAddModal(false);
    setNewCustomer({ name: '', email: '', phone: '', status: 'Active' });
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Add failed');
  }
};

 const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/customers', {
        params: {
          search,
          status: statusFilter
        }
      });
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/customers/${id}/status`, {
        status: newStatus
      });
      toast.success(`Customer ${newStatus}`);
      fetchCustomers();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[55px]">

    <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Customer Management</h2>
    <button
    className="bg-blue-600 text-white px-4 py-2 rounded"
    onClick={() => setShowAddModal(true)}
  >
    + Add Customer
    </button>
  </div>

  {showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
      <button
        onClick={() => setShowAddModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full border p-2 rounded mb-2"
        value={newCustomer.name}
        onChange={(e) =>
          setNewCustomer({ ...newCustomer, name: e.target.value })
        }
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded mb-2"
        value={newCustomer.email}
        onChange={(e) =>
          setNewCustomer({ ...newCustomer, email: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Phone"
        className="w-full border p-2 rounded mb-2"
        value={newCustomer.phone}
        onChange={(e) =>
          setNewCustomer({ ...newCustomer, phone: e.target.value })
        }
      />
      <select
        className="w-full border p-2 rounded mb-4"
        value={newCustomer.status}
        onChange={(e) =>
          setNewCustomer({ ...newCustomer, status: e.target.value })
        }
      >
        <option value="Active">Active</option>
        <option value="Blocked">Blocked</option>
      </select>

      <button
        onClick={handleAddCustomer}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        Add Customer
      </button>
    </div>
  </div>
)}

      <div className="flex flex-wrap mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by Name, Email, Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {loading ? (
  <div className="text-center text-lg font-semibold">Loading...</div>
) : (
  <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
    <table className="min-w-full bg-white divide-y divide-gray-200">
      <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
        <tr>
          <th className="px-4 py-3 text-left">ID</th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Created At</th>
          <th className="px-4 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {customers.map((cust) => (
          <tr key={cust._id} className="hover:bg-gray-50">
            <td className="px-4 py-3">{cust._id.slice(-6)}</td>
            <td className="px-4 py-3">{cust.name}</td>
            <td className="px-4 py-3">{cust.email}</td>
            <td className="px-4 py-3">{cust.phone}</td>
            <td className="px-4 py-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  cust.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {cust.status}
              </span>
            </td>
            <td className="px-4 py-3">{new Date(cust.created_at).toLocaleString()}</td>
            <td className="px-4 py-3 flex items-center gap-2">
              <select
                className="border border-gray-300 text-sm rounded px-2 py-1 focus:outline-none"
                value={cust.status}
                onChange={(e) => updateStatus(cust._id, e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              <button
                onClick={() => handleDeleteCustomer(cust._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default CustomerManagement;
