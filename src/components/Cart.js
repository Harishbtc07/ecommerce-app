import React, { useEffect, useState } from 'react';
import '../App.css';

const Cart = ({ decreaseCartCount }) => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/cart/1`) 
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart(data.cart);
        }
      });
  }, []);

  const removeFromCart = (productId) => {
    fetch(`http://localhost:5000/cart/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 1,
        product_id: productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId)
          );
          decreaseCartCount(); // Update count in the navbar
          setMessage(data.message);
        } else {
          setMessage('Failed to remove item from cart');
        }
      });
  };
  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>
      {message && <p className="message">{message}</p>} {/* Display message */}
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} className="item-image" />
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <p className="item-price">Price: ${item.price}</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-button"
              >
                Remove from Cart
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="empty-message">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
