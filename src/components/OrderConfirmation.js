import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  const handleCancelOrder = () => {
    // Use a hardcoded order_id for example purposes
    fetch('http://localhost:5000/order/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: 1 }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          navigate('/products');  // Redirect to products page after canceling
        }
      });
  };

  return (
    <div>
      <h2>{message || 'Your order is confirmed.'}</h2>
      <button onClick={handleCancelOrder}>Cancel Order</button>
    </div>
  );
};

export default OrderConfirmation;
