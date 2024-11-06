import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css'; 

const ProductDetails = ({ updateWishlistCount, updateCartCount }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
        } else {
          setMessage('Failed to load product details.');
        }
      })
      .catch((error) => setMessage('An error occurred. Please try again.'));
  }, [id]);

  const handleAddToWishlist = () => {
    fetch(`http://localhost:5000/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: 1, product_id: product.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          updateWishlistCount();
          setMessage('Added to wishlist successfully!');
        } else {
          setMessage('Failed to add to wishlist.');
        }
      })
      .catch(() => setMessage('An error occurred. Please try again.'));
  };

  const handleAddToCart = () => {
    fetch(`http://localhost:5000/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: 1, product_id: product.id, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          updateCartCount();
          setMessage('Added to cart successfully!');
        } else {
          setMessage('Failed to add to cart.');
        }
      })
      .catch(() => setMessage('An error occurred. Please try again.'));
  };

  if (!product) {
    return <div className="container">{message}</div>;
  }

  return (
    <div className="container product-details">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid rounded shadow-lg"
          />
        </div>
        <div className="col-md-6">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price}</p>
          {message && <p className="message">{message}</p>} 
          <button className="btn btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="btn btn-outline-danger" onClick={handleAddToWishlist}>
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
