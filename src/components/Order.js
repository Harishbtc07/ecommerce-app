import React, { useEffect, useState } from 'react';
import '../App.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // "success" or "error"

  useEffect(() => {
    fetch('http://localhost:5000/orders')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const handleCancelOrder = (orderId) => {
    fetch('http://localhost:5000/cancel_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: orderId }), // Send product_id for cancellation
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('Order canceled successfully.');
          setMessageType('success');
          // Update the UI to reflect the canceled order
          setOrders(orders.filter(order => order.id !== orderId));
        } else {
          setMessage(data.message || 'Failed to cancel the order. Please try again.');
          setMessageType('error');
        }
      })
      .catch(() => {
        setMessage('An error occurred while canceling the order. Please try again.');
        setMessageType('error');
      });
  };

  return (
    <div className="container orders-page">
      <h2>My Orders</h2>
      {message && (
        <p className={`order-message ${messageType}`}>{message}</p>
      )}
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <img src={order.image_url} alt={order.product_name} className="product-image" />
              <div className="order-details">
                <p><strong>Product Name:</strong> {order.product_name}</p>
                <p><strong>Price:</strong> ${order.price}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
              </div>
              <button
                className="btn btn-danger cancel-order-btn"
                onClick={() => handleCancelOrder(order.id)}
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders-message">You have no orders.</p>
      )}
    </div>
  );
};

export default Orders;
