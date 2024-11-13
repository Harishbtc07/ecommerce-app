import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    if (!orderId) {
      setErrorMessage('Please enter a valid Order ID.');
      return;
    }

    fetch(`http://localhost:5000/track-order/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderStatus(data.status);
          setErrorMessage('');
        } else {
          setErrorMessage(data.message || 'Order not found.');
        }
      })
      .catch(() => setErrorMessage('An error occurred. Please try again.'));
  };

  return (
    <div className="container">
      <h2>Track Your Order</h2>
      <div>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
        />
        <button onClick={handleTrackOrder}>Track Order</button>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {orderStatus && <p>Order Status: {orderStatus}</p>}
    </div>
  );
};

export default OrderTracking;
