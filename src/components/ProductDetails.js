import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css'; 

const ProductDetails = () => {
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
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
