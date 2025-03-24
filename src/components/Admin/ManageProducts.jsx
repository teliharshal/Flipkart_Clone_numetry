import React, { useState, useEffect } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null); // Track editing state

  // Load products from localStorage when component mounts
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, []);

  // Save products to localStorage
  const saveToLocalStorage = (updatedProducts) => {
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  // Add or update product
  const handleSaveProduct = () => {
    if (newProduct.name && newProduct.price) {
      let updatedProducts;
      if (editingProduct) {
        // Update existing product
        updatedProducts = products.map((product) =>
          product.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : product
        );
        setEditingProduct(null);
      } else {
        // Add new product
        updatedProducts = [...products, { ...newProduct, id: Date.now() }];
      }
      saveToLocalStorage(updatedProducts);
      setNewProduct({ name: "", price: "" });
    }
  };

  // Delete a product
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((product) => product.id !== id);
      saveToLocalStorage(updatedProducts);
    }
  };

  // Edit a product
  const handleEditProduct = (product) => {
    setNewProduct({ name: product.name, price: product.price });
    setEditingProduct(product);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-[39px]">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Manage Products</h2>

      {/* Add / Edit Product Form */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-3 flex-1 rounded-md shadow-sm"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-3 flex-1 rounded-md shadow-sm"
        />
        <button
          onClick={handleSaveProduct}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          {editingProduct ? "Update" : "Add"} Product
        </button>
      </div>

      {/* Product List */}
      <div className="border p-4 rounded-lg shadow bg-white">
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.id} className="flex justify-between items-center border-b p-3">
                <span className="text-lg text-gray-800">
                  {product.name} - ₹{product.price}
                </span>
                <div>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-yellow-500 px-3 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 px-3 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
