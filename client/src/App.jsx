import React, { useEffect } from 'react';
import {  Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StartScreen from './StartScreen.jsx';
import { UserContextProvider } from './pages/userContext.jsx';
import Warehouse from './pages/Warehouse.jsx';
import WarehouseAssets from './pages/WarehouseAssets.jsx';
import History from './pages/History.jsx';
import ProtectedRoute from './components/ProtectedRoute';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <UserContextProvider>
     
        <Header />
        <Navbar />
        <Toaster position="center" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard"element={<Dashboard />}/>

          {/* Protected Routes */}
          <Route
            path="/startscreen"
            element={
              <ProtectedRoute>
                <StartScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse"
            element={
              <ProtectedRoute>
                <Warehouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/:id"
            element={
              <ProtectedRoute>
                <WarehouseAssets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history/:warehouseId"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      
    </UserContextProvider>
  );
}

export default App;


