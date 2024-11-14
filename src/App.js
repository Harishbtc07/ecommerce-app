import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails'; 
import PrivateRoute from './components/PrivateRoute';
import Wishlist from './components/Wishlist'; 
import Cart from './components/Cart'; 
import OrderConfirmed from './components/OrderConfirmed';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateWishlistCount = () => setWishlistCount(prevCount => prevCount + 1);
  const updateCartCount = () => setCartCount(prevCount => prevCount + 1);
  const decreaseWishlistCount = () => setWishlistCount(prevCount => Math.max(prevCount - 1, 0));
  const decreaseCartCount = () => setCartCount(prevCount => Math.max(prevCount - 1, 0));

  const cancelOrder = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/cancel_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }), // Send product_id instead of order_id
      });
  
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        // Additional state updates if needed
      } else {
        alert('Failed to cancel the order');
      }
    } catch (error) {
      console.error('Error canceling the order:', error);
      alert('An error occurred while canceling the order');
    }
  };
  return (
    <div className="App">
      <Navigation 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route
          path="/products"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProductDetails updateWishlistCount={updateWishlistCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Wishlist decreaseWishlistCount={decreaseWishlistCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Cart decreaseCartCount={decreaseCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-confirmed"
          element={<OrderConfirmed cancelOrder={cancelOrder} />}
        />
      </Routes>
    </div>
  );
}

export default App;
