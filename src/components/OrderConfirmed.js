import React, { useState } from 'react';
import { useLocation,} from 'react-router-dom';
import '../App.css'; // Import the CSS file for styling

const OrderConfirmed = () => {
  const location = useLocation();
  const productData = location.state?.product;
  const [product, setProduct] = useState(productData);
  const [message, setMessage] = useState('Your order has been placed successfully!');
  const [messageType, setMessageType] = useState('success'); // "success" or "error"

  const handleCancelOrder = () => {
    fetch('http://localhost:5000/cancel_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: product.id }), // Use product_id for cancellation
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('Your order has been successfully canceled.');
          setMessageType('error'); // Set to "error" to display in red
          setProduct(null); // Clear product details after cancellation
        } else {
          setMessage('Failed to cancel the order. Please try again.');
          setMessageType('error'); // Set to "error" for red color on error
        }
      })
      .catch(() => {
        setMessage('An error occurred while canceling the order. Please try again.');
        setMessageType('error'); // Set to "error" for red color on error
      });
  };

  return (
    <div className="container order-confirmed">
      <h2 className="order-confirmed-title">Order Confirmation</h2>
      <p className={`order-confirmed-message ${messageType}`}>{message}</p>  {/* Display success/error message */}
      {product ? (
        <div className="order-details">
          <h3>Order Details:</h3>
          <img src={product.image_url} alt={product.name} className="product-image" />
          <p><strong>Product Name:</strong> {product.name}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
        </div>
      ) : null}
      {product && (
        <button className="btn btn-danger cancel-order-btn" onClick={handleCancelOrder}>
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderConfirmed;
