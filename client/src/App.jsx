import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Header from '../src/components/Header';
import Navbar from '../src/components/Navbar';
import Home from '../src/pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from '../src/pages/Dashboard';
import StartScreen from './StartScreen.jsx';
import { UserContextProvider } from '../src/pages/userContext';
import Warehouse from './pages/Warehouse.jsx';
import WarehouseAssets from './pages/WarehouseAssets.jsx';


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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <UserContextProvider>
      <Header />
      <Navbar />
      <Toaster position="center" toastOptions={{ duration: 3000 }} />
      
      {/* Game and routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/warehouse/:id" element={<WarehouseAssets />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/startscreen" element={<StartScreen />} />
      </Routes>

    </UserContextProvider>
  );
}

export default App;

