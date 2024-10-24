import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails'; // Import the ProductDetails component
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <Navigation 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
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
        {/* Add route for product details */}
        <Route
          path="/products/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProductDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
