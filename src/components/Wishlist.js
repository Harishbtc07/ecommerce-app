import React, { useEffect, useState } from 'react';
import '../App.css';

const Wishlist = ({ decreaseWishlistCount }) => {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/wishlist/1`) 
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWishlist(data.wishlist);
        }
      });
  }, []);

  const removeFromWishlist = (productId) => {
    fetch(`http://localhost:5000/wishlist/remove`, {
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
          setWishlist((prevWishlist) =>
            prevWishlist.filter((item) => item.id !== productId)
          );
          decreaseWishlistCount(); // Update count in the navbar
          setMessage(data.message);
        } else {
          setMessage('Failed to remove item from wishlist');
        }
      });
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      {message && <p className="message">{message}</p>} {/* Display message */}
      {wishlist.length > 0 ? (
        wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <img src={item.image_url} alt={item.name} className="item-image" />
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <p className="item-price">Price: ${item.price}</p>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="remove-button"
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="empty-message">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
