import { useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "",image: "" })
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // ✅ Fetch products
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
    fetchProducts();
    const interval = setInterval(() => fetchProducts(), 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Open modal for adding/editing product
  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price, 
      stock: product.stock, 
      category: product.category, 
      imageUrl: product.image // ✅ Added image URL field
    });
    setShowModal(true);
  };

  // ✅ Save product (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/update/${editingProduct._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/products/add", formData);
      }
      fetchProducts();
      setFormData({ name: "", price: "", stock: "", category: "" ,image: ""});
      setEditingProduct(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // ✅ Delete single product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ✅ Delete multiple selected products
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

  // ✅ Handle product selection for multi-delete
  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  // ✅ Bulk Product Import (CSV)
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

  // ✅ Filtering logic
  useEffect(() => {
    let filtered = products;
    if (searchTerm) filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoryFilter) filtered = filtered.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    if (stockFilter) {
      if (stockFilter === "In Stock") filtered = filtered.filter((p) => p.stock > 0);
      else if (stockFilter === "Out of Stock") filtered = filtered.filter((p) => p.stock === 0);
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, products]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage); // Avoid zero pages issue
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

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

      {/* ✅ Add Product Button */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
  <input 
    type="text" 
    name="name" 
    value={formData.name} 
    onChange={handleChange} 
    placeholder="Product Name" 
    required 
    className="w-full p-2 mb-2 border rounded" 
  />
  
  <input 
    type="number" 
    name="price" 
    value={formData.price} 
    onChange={handleChange} 
    placeholder="Price" 
    required 
    className="w-full p-2 mb-2 border rounded" 
  />
  
  <input 
    type="number" 
    name="stock" 
    value={formData.stock} 
    onChange={handleChange} 
    placeholder="Stock" 
    required 
    className="w-full p-2 mb-2 border rounded" 
  />
  
  <input 
    type="text" 
    name="category" 
    value={formData.category} 
    onChange={handleChange} 
    placeholder="Category" 
    required 
    className="w-full p-2 mb-2 border rounded" 
  />

  {/* ✅ Image Upload Input */}
  <input 
    type="text" 
    name="imageUrl" 
    value={formData.image} 
    onChange={handleChange} 
    placeholder="Image URL" 
    required 
    className="w-full p-2 mb-2 border rounded" 
  />

  <button 
    type="submit" 
    className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
  >
    {editingProduct ? "Update Product" : "Add Product"}
  </button>
</form>


      {/* ✅ Delete Selected Button */}
      <button onClick={deleteSelectedProducts} className="bg-red-500 text-white px-4 py-2 rounded mb-4 ml-2" disabled={selectedProducts.length === 0}>
        Delete Selected
      </button>

      {/* ✅ Product Table */}
      <table className="w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-200">
      <th className="border p-2">Select</th>
      <th className="border p-2">Image</th> {/* ✅ Added Image Column */}
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
        <td className="border p-2">
          <input
            type="checkbox"
            onChange={() => toggleProductSelection(product._id)}
            checked={selectedProducts.includes(product._id)}
          />
        </td>

        <td className="border p-2">
  <LazyLoadImage
    src={product.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzSOrIHIncvVwcn86Yj1lG2no3rymRPhF1AQ&s"}
    alt={product.name}
    className="w-16 h-16 object-cover rounded"
    effect="blur" // Use "none" to avoid blur effect
    onError={(e) => (e.target.src = "https://via.placeholder.com/64")}
  />
</td>
        <td className="border p-2">{product.name}</td>
        <td className="border p-2">${product.price}</td>
        <td className="border p-2">{product.stock}</td>
        <td className="border p-2">{product.category}</td>
        <td className="border p-2">
          <button
            onClick={() => editProduct(product)}
            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => deleteProduct(product._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

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
