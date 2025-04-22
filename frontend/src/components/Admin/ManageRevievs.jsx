import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState({ search: '' });
  const [selectedReview, setSelectedReview] = useState(null);
  const [response, setResponse] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    userName: '',
    rating: 5,
    comment: '',
  });

  const fetchReviews = async () => {
    const { data } = await axios.get('http://localhost:5000/api/reviews');
    setReviews(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', formData);
      toast.success('Review submitted successfully');
      setFormData({
        productName: '',
        userName: '',
        rating: 5,
        comment: '',
      });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/reviews/${id}/status`, { status });
    toast.success(`Review ${status.toLowerCase()} successfully`);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    await axios.delete(`http://localhost:5000/api/reviews/${id}`);
    toast.success('Review deleted successfully');
    fetchReviews();
  };

  const submitResponse = async (id) => {
    await axios.post(`http://localhost:5000/api/reviews/${id}/respond`, { response });
    toast.success('Response submitted successfully');
    setSelectedReview(null);
    setResponse('');
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) =>
    review.user.name.toLowerCase().includes(filter.search.toLowerCase()) ||
    review.product.name.toLowerCase().includes(filter.search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 mt-14 text-center">🛠 Manage Product Reviews</h2>

      {/* Review Submission Form */}
      

      {/* Review Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-left text-sm text-gray-600 uppercase tracking-wider">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review._id} className="border-b text-sm">
                <td className="px-4 py-3">{review.product.name}</td>
                <td className="px-4 py-3">{review.user.name}</td>
                <td className="px-4 py-3">{'⭐'.repeat(review.rating)}</td>
                <td className="px-4 py-3">{review.comment}</td>
                <td className="px-4 py-3">{new Date(review.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => updateStatus(review._id, 'Approved')} className="text-green-600 hover:underline">Approve</button>
                  <button onClick={() => updateStatus(review._id, 'Rejected')} className="text-yellow-600 hover:underline">Reject</button>
                  <button onClick={() => deleteReview(review._id)} className="text-red-600 hover:underline">Delete</button>
                  <button onClick={() => setSelectedReview(review)} className="text-blue-600 hover:underline">Respond</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-3">📄 Review Details</h3>
            <p><strong>Product:</strong> {selectedReview.product.name}</p>
            <p><strong>Customer:</strong> {selectedReview.user.name}</p>
            <p><strong>Rating:</strong> {'⭐'.repeat(selectedReview.rating)}</p>
            <p><strong>Comment:</strong> {selectedReview.comment}</p>
            <p><strong>Status:</strong> {selectedReview.status}</p>
            {selectedReview.adminResponse && (
              <p><strong>Admin Response:</strong> {selectedReview.adminResponse}</p>
            )}
            <textarea
              className="border rounded w-full mt-4 p-2"
              rows="3"
              placeholder="Write a response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-between">
              <button onClick={() => submitResponse(selectedReview._id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Submit Response
              </button>
              <button onClick={() => setSelectedReview(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

<ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default ManageReviews;
