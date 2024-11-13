import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderConfirmed = () => {
  const location = useLocation();
  const product = location.state?.product;

  return (
    <div className="container">
      <h2>Your order has been placed successfully!</h2>
      <p>Thank you for shopping with us. Your order is confirmed and will be processed shortly.</p>
      {product && (
        <div className="order-details">
          <h3>Order Details:</h3>
          <img src={product.image_url}/>
          <p><strong>Product Name:</strong> {product.name}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmed;
