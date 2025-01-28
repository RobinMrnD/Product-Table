function ProductTable({ products, onEdit, onDelete, onRowClick }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            onClick={() => onRowClick(product)} 
            style={{ cursor: "pointer", backgroundColor: "#f9f9f9" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e9e9e9")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
          >
            <td>
              <img
                src={product.thumbnail || "/placeholder.svg"}
                alt={product.title}
                className="product-thumbnail"
              />
            </td>
            <td>{product.title}</td>
            <td>{product.brand}</td>
            <td>
              ${product.price}
              {product.discountPercentage > 0 && (
                <span className="discount">{Math.round(product.discountPercentage)}% OFF</span>
              )}
            </td>
            <td>{product.rating}</td>
            <td>
              <button
                className="edit-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onEdit(product);
                }}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (window.confirm("Are you sure you want to delete this smartphone?")) {
                    onDelete(product.id);
                  }
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
