import { useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./ManageProducts.css"; // Your custom styles

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "", image: "", createdAt: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const productsPerPage = 4;

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => fetchProducts(), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      const productsData = response.data.products;
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/update/${editingProduct._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/products/add", formData);
      }
      fetchProducts();
      setFormData({ name: "", price: "", stock: "", category: "", image: "", createdAt: "" });
      setEditingProduct(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };


  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const deleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;
    try {
      await axios.post("http://localhost:5000/api/products/delete-multiple", { ids: selectedProducts });
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting selected products:", error);
    }
  };

  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:5000/api/products/import", formData);
      fetchProducts();
    } catch (error) {
      console.error("Error importing CSV:", error);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
      createdAt: product.createdAt?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (stockFilter) {
      if (stockFilter === "In Stock") {
        filtered = filtered.filter((p) => p.stock > 0);
      } else if (stockFilter === "Out of Stock") {
        filtered = filtered.filter((p) => p.stock === 0);
      }
    }

    if (dateSort === "Newest First") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateSort === "Oldest First") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, dateSort, products]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map((product) => product._id));
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4 border p-2" />
      <button onClick={() => setDarkMode(!darkMode)} className="ml-4">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 flex-1 rounded-lg"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 flex-1 rounded-lg bg-gray-800 text-white"
        >
          <option value="">All Categories</option>
          <option value="Accessories">Accessories</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Audio">Audio</option>
          <option value="Laptops">Laptops</option>
          <option value="Smartwatches">Smartwatches</option>
          <option value="Gaming">Gaming</option>
          <option value="Others">Others</option>
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="border p-2 flex-1 rounded-lg bg-gray-800 text-white"
        >
          <option value="">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <select
          value={dateSort}
          onChange={(e) => setDateSort(e.target.value)}
          className="border p-2 flex-1 rounded-lg bg-gray-800 text-white"
        >
          <option value="">Sort by Date</option>
          <option value="Newest First">Newest First</option>
          <option value="Oldest First">Oldest First</option>
        </select>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-2 mb-2 border rounded" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 mb-2 border rounded" />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required className="w-full p-2 mb-2 border rounded" />
        <input type="date" name="createdAt" value={formData.createdAt} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      <button onClick={deleteSelectedProducts} className="bg-red-500 text-white px-4 py-2 rounded mb-4 ml-2" disabled={selectedProducts.length === 0}>
        Delete Selected
      </button>

      {/* Product Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border p-2"><input type="checkbox" onChange={toggleSelectAll} checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0} /></th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Date Added</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id} className="text-center">
              <td className="border p-2"><input type="checkbox" onChange={() => toggleProductSelection(product._id)} checked={selectedProducts.includes(product._id)} /></td>
              <td className="border p-2">
                {loading && <div className="animate-spin w-6 h-6 border-t-2 border-blue-500 rounded-full mx-auto" />}
                <LazyLoadImage
                  src={product.image || "https://via.placeholder.com/64"}
                  alt={product.name}
                  className="w-16 h-16 object-cover mx-auto"
                  effect="blur"
                  placeholderSrc="https://via.placeholder.com/64"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64";
                  }}
                />
              </td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">₹{product.price}</td>
              <td className="border p-2">
  {product.stock}
  {product.stock <= 5 && (
    <span className="ml-2 text-red-500 font-bold" title="Low stock">⚠️</span>
  )}
</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.createdAt?.split("T")[0]}</td>
              <td className="border p-2">
                <button onClick={() => editProduct(product)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => deleteProduct(product._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


 
 {/* ✅ Improved Product Editing Modal */}
  {showModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300"
    onClick={() => setShowModal(false)} // Close on outside click
  >
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg transform transition-all scale-95"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {editingProduct ? "Edit Product" : "Add Product"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {editingProduct ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 mx-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageProducts;
