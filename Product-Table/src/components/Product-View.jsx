import { useState, useRef } from "react";

function ProductView({ product, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);

  if (!isOpen || !product) return null;

  const images = [product.thumbnail, ...(Array.isArray(product.images) ? product.images : [])];

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal" ref={modalRef}>
        <div className="header">
          <h2 className="title">{product.title}</h2>
        </div>

        <div className="image-container">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.title}
            className="main-image"
          />
          <button className="image-nav prev" onClick={goToPreviousImage}>
            &#8249;
          </button>
          <button className="image-nav next" onClick={goToNextImage}>
            &#8250;
          </button>
        </div>

        {product.images && (
          <div className="thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img || "/placeholder.svg"}
                alt={`${product.title} view ${index + 1}`}
                className={`thumbnail ${currentImageIndex === index ? "active-thumbnail" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}

        <div className="price">
          ${product.price}
          {product.discountPercentage > 0 && (
            <span className="discount">{Math.round(product.discountPercentage)}% OFF</span>
          )}
        </div>

        <div className="rating">
          <div className="viewType">
            <small>Rating:</small>
            <br />
          </div>
          {product.rating} / 5
        </div>

        <div className="description">
          <div className="viewType">
            <small>Description:</small>
            <br />
          </div>
          {product.description}
        </div>

        <div className="viewText">
          <div className="viewType">
            <small>Brand:</small>
            <br />
          </div>
          {product.brand}
        </div>

        <div className="viewText">
          <div className="viewType">
            <small>Category:</small>
            <br />
          </div>
          {product.category}
        </div>

        <div className="viewText">
          <div className="viewType">
            <small>Stock:</small>
            <br />
          </div>
          {product.stock} units available
        </div>

        <div className="footer">
          <hr />
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
