import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails'; 
import PrivateRoute from './components/PrivateRoute';
import Wishlist from './components/Wishlist'; // Import Wishlist
import Cart from './components/Cart'; // Import Cart

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateWishlistCount = () => setWishlistCount(prevCount => prevCount + 1);
  const updateCartCount = () => setCartCount(prevCount => prevCount + 1);
  const decreaseWishlistCount = () => setWishlistCount(prevCount => Math.max(prevCount - 1, 0));
  const decreaseCartCount = () => setCartCount(prevCount => Math.max(prevCount - 1, 0));

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
      </Routes>
    </div>
  );
}

export default App;