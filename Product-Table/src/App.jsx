import { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "./components/Product-Table.jsx";
import ProductForm from "./components/Product-Form.jsx";
import SearchBar from "./components/Search-Bar.jsx";
import ProductView from "./components/Product-View.jsx"; 
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  useEffect(() => {
    fetchSmartphoneProducts();
  }, []);

  const fetchSmartphoneProducts = async () => {
    try {
      const response = await axios.get(
        "https://dummyjson.com/products/category/smartphones"
      );
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching smartphone products:", error);
      setLoading(false);
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };


  const handleSearch = (searchTerm) => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/products/add",
        {
          ...productData,
          category: "smartphones",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const newProduct = response.data;
      setProducts([...products, newProduct]);
      setFilteredProducts([...filteredProducts, newProduct]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding smartphone product:", error);
    }
  };
  
  const handleEditProduct = async (productData) => {
    try {
      if (!productData.id) {
        throw new Error("Product ID is required to update a product.");
      }
      const response = await axios.put(
        `https://dummyjson.com/products/${productData.id}`,
        {
          ...productData,
          category: "smartphones",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const updatedProduct = response.data;
  
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
  
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  


  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`https://dummyjson.com/products/${productId}`);
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting smartphone product:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container">
      <h1 className="header">SMARTPHONES</h1>

      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <button
          className="add-button"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Add Smartphone
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading smartphone products...</div>
      ) : (
        <>
          <ProductTable
            products={currentItems}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onDelete={handleDeleteProduct}
            onRowClick={handleRowClick}
          />
          <ProductView
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />

          <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
            <strong>
              Page {currentPage} of {totalPages}
            </strong>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>
        </>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
