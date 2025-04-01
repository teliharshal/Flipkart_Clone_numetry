import { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered list
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Products per page

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      const productsData = response.data.products; // Assuming products array is returned
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        setFilteredProducts(productsData); // Initialize filtered data
      } else {
        console.error("Fetched data is not an array:", productsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/update/${editingProduct._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/products/add", formData);
      }
      fetchProducts(); // Fetch updated list
      setFormData({ name: "", price: "", stock: "", category: "" });
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // ✅ Edit product
  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
  };

  // ✅ Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ✅ Bulk Product Import (CSV Upload)
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

  // ✅ Filtering Logic
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (stockFilter) {
      if (stockFilter === "In Stock") {
        filtered = filtered.filter((p) => p.stock > 0);
      } else if (stockFilter === "Out of Stock") {
        filtered = filtered.filter((p) => p.stock === 0);
      }
    }
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchTerm, categoryFilter, stockFilter, products]);

  // ✅ Pagination Logic
  // ✅ Ensure the total pages are correctly calculated
const totalPages = Math.ceil(filteredProducts.length / productsPerPage); // Avoid zero pages issue
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? "Edit Product" : "Manage Products"}</h2>

      {/* ✅ CSV Upload */}
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4 border p-2" />

      {/* ✅ Search & Filters */}
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="Search by Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-2 flex-1" />
        <input type="text" placeholder="Filter by Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 flex-1" />
        <select onChange={(e) => setStockFilter(e.target.value)} className="border p-2">
          <option value="">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* ✅ Add / Edit Product Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-2 mb-2 border rounded" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 mb-2 border rounded" />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="w-full p-2 mb-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ✅ Product Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id} className="text-center">
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">{product.stock}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">
                <button onClick={() => editProduct(product)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Dynamic Pagination */}
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 mx-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
