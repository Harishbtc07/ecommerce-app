import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'

const OrderConfirmed = () => {
  const location = useLocation();
  const product = location.state?.product;
  const [message, setMessage] = useState('Your order has been placed successfully!');
  const navigate = useNavigate();

  const handleCancelOrder = () => {
    // Send cancel request to backend
    fetch('http://localhost:5000/cancel_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: product.id }),  // Use product_id for cancellation
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('Your order has been successfully canceled.');  // Update message on successful cancellation
        } else {
          setMessage('Failed to cancel the order. Please try again.');  // Show error message
        }
      })
      .catch(() => {
        setMessage('An error occurred while canceling the order. Please try again.');  // Handle errors
      });
  };

  return (
    <div className="container order-confirmed">
      <h2 className="order-confirmed-title">Order Confirmation</h2>
      <p className="order-confirmed-message">{message}</p>  {/* Display success/error message */}
      {product && (
        <div className="order-details">
          <h3>Order Details:</h3>
          <img src={product.image_url} alt={product.name} className="product-image" />
          <p><strong>Product Name:</strong> {product.name}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
        </div>
      )}
      <button className="btn btn-danger cancel-order-btn" onClick={handleCancelOrder}>
        Cancel Order
      </button>
    </div>
  );
};

export default OrderConfirmed;
